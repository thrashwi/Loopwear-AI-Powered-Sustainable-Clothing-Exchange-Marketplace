// Comprehensive Loopwear Test Suite
process.env.NODE_ENV = 'test';
import http from 'http';
import { app, server } from './index.js';

const PORT = 5099;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...headers
      }
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Loopwear End-to-End Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Start test server on port 5099
  const testServer = app.listen(PORT);
  await new Promise(r => setTimeout(r, 800));

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.data.status === 'ok', 'Health check API returns 200 OK');

    // 2. Auth: Register new user
    const testEmail = `tester_${Date.now()}@example.com`;
    const regRes = await request('POST', '/api/auth/register', {
      name: 'Test Swapper',
      username: `tester_${Date.now()}`,
      email: testEmail,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      location: 'Indiranagar, Bengaluru',
      termsAccepted: true
    });
    assert(regRes.status === 201 && regRes.data.success && regRes.data.token, 'User registration with bcrypt hashing returns 201 and token');
    const newUserToken = regRes.data.token;
    const newUserId = regRes.data.user.id;

    // 3. Auth: Duplicate registration prevention
    const dupRes = await request('POST', '/api/auth/register', {
      name: 'Duplicate User',
      username: 'rahul_s',
      email: 'rahul@example.com',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      termsAccepted: true
    });
    assert(dupRes.status === 400 && !dupRes.data.success, 'Duplicate registration is rejected with 400 Bad Request');

    // 4. Auth: Login with seeded user
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'rahul@example.com',
      password: 'Rahul@123'
    });
    assert(loginRes.status === 200 && loginRes.data.success && loginRes.data.token, 'Login with valid credentials succeeds and returns JWT');
    const rahulToken = loginRes.data.token;

    // 5. Auth: Login with invalid password
    const badLogin = await request('POST', '/api/auth/login', {
      email: 'rahul@example.com',
      password: 'WrongPassword'
    });
    assert(badLogin.status === 401 && !badLogin.data.success, 'Login with invalid password rejected with 401 Unauthorized');

    // 6. Auth: GET /api/auth/me
    const meRes = await request('GET', '/api/auth/me', null, { Authorization: `Bearer ${rahulToken}` });
    assert(meRes.status === 200 && meRes.data.user.name === 'Rahul Sharma', 'GET /api/auth/me identifies authenticated user correctly');

    // 7. Listings: Get all items & verify location/category filter
    const itemsRes = await request('GET', '/api/items?category=Tops');
    assert(itemsRes.status === 200 && itemsRes.data.items.length > 0, 'GET /api/items filters by category correctly');

    // 8. Listings: Create new item for new user
    const createItemRes = await request('POST', '/api/items', {
      title: 'Vintage Leather Biker Jacket',
      brand: 'AllSaints',
      category: 'Jackets & Outerwear',
      size: 'M',
      condition: 'Like New',
      color: 'Black',
      estimatedValue: 3500,
      description: 'Supple lambskin leather jacket with asymmetrical zip.',
      location: 'Indiranagar, Bengaluru'
    }, { Authorization: `Bearer ${newUserToken}` });
    assert(createItemRes.status === 201 && createItemRes.data.item.ownerId === newUserId, 'POST /api/items creates listing associated with current user');
    const createdItemId = createItemRes.data.item.id;

    // 9. Listings: Ownership enforcement (prevent unauthorized user from deleting)
    const unauthorizedDelete = await request('DELETE', `/api/items/${createdItemId}`, null, { Authorization: `Bearer ${rahulToken}` });
    assert(unauthorizedDelete.status === 403, 'Unauthorized user cannot delete another users listing');

    // 10. Dashboard API
    const dashRes = await request('GET', '/api/dashboard', null, { Authorization: `Bearer ${rahulToken}` });
    assert(dashRes.status === 200 && dashRes.data.metrics.totalListings >= 0, 'GET /api/dashboard returns authorized live metrics');

    // 11. Swaps: Prevent swapping own item
    const selfSwap = await request('POST', '/api/swaps', {
      requestedItemId: 'item_1',
      offeredItemId: 'item_1'
    }, { Authorization: `Bearer ${rahulToken}` });
    assert(selfSwap.status === 400, 'System prevents user proposing a swap on their own listing');

    // 12. Swaps: Propose valid swap between fresh items
    const ananyaLogin = await request('POST', '/api/auth/login', {
      email: 'ananya@example.com',
      password: 'Ananya@123'
    });
    const ananyaToken = ananyaLogin.data.token;

    const ananyaItemRes = await request('POST', '/api/items', {
      title: 'Zara Silk Blouse ' + Date.now(),
      brand: 'Zara',
      category: 'Tops',
      size: 'S',
      condition: 'Like New',
      color: 'Emerald',
      estimatedValue: 1800,
      description: 'Airy silk button-down blouse.'
    }, { Authorization: `Bearer ${ananyaToken}` });
    const ananyaItemId = ananyaItemRes.data.item.id;

    const swapProposal = await request('POST', '/api/swaps', {
      requestedItemId: ananyaItemId, // owned by Ananya
      offeredItemId: createdItemId, // owned by new user
      message: 'Hello Ananya, would love to trade this jacket!'
    }, { Authorization: `Bearer ${newUserToken}` });
    assert(swapProposal.status === 201 && swapProposal.data.swap.status === 'pending', 'POST /api/swaps initiates swap proposal and AI evaluation');
    const testSwapId = swapProposal.data.swap.id;

    // 13. Swaps: Accept swap by recipient (Ananya)
    const acceptRes = await request('POST', `/api/swaps/${testSwapId}/accept`, null, { Authorization: `Bearer ${ananyaToken}` });
    assert(acceptRes.status === 200 && acceptRes.data.swap.status === 'accepted', 'POST /api/swaps/:id/accept reserves items and marks accepted');

    // 14. Swaps: Mark complete and verify sustainability increment
    const completeRes = await request('POST', `/api/swaps/${testSwapId}/complete`, null, { Authorization: `Bearer ${ananyaToken}` });
    assert(completeRes.status === 200 && completeRes.data.swap.status === 'completed', 'POST /api/swaps/:id/complete marks swap completed and awards sustainability metrics');

    // 15. Chat: Get conversation & send message
    const chatMsgRes = await request('POST', `/api/chat/${testSwapId}/messages`, {
      text: 'Thank you for the wonderful trade!'
    }, { Authorization: `Bearer ${ananyaToken}` });
    assert(chatMsgRes.status === 201 && chatMsgRes.data.message.text.includes('wonderful'), 'POST /api/chat/:id/messages persists and returns message');

    // 16. Admin API: Role-based protection check (reject regular user)
    const adminForbidden = await request('GET', '/api/admin/analytics', null, { Authorization: `Bearer ${rahulToken}` });
    assert(adminForbidden.status === 403, 'Regular users cannot access administrative endpoints (RBAC enforced)');

    // 17. Admin API: Allowed for admin
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@loopwear.com',
      password: 'Admin@12345'
    });
    const adminToken = adminLogin.data.token;

    const adminAnalytics = await request('GET', '/api/admin/analytics', null, { Authorization: `Bearer ${adminToken}` });
    assert(adminAnalytics.status === 200 && adminAnalytics.data.analytics.users.total > 0, 'Admin can access analytics and user management');

    // 18. AI Services: Description generator
    const aiDesc = await request('POST', '/api/ai/generate-description', {
      brand: 'Zara',
      category: 'Jackets & Outerwear',
      condition: 'Like New',
      size: 'M',
      color: 'Navy'
    });
    assert(aiDesc.status === 200 && aiDesc.data.title && aiDesc.data.description, 'AI Clothing Description generator produces title, description and tags');

    // 19. AI Services: Fair swap evaluator
    const aiEval = await request('POST', '/api/ai/evaluate-swap', {
      offeredItemId: 'item_1',
      requestedItemId: 'item_2'
    });
    assert(aiEval.status === 200 && aiEval.data.verdict && aiEval.data.score !== undefined, 'AI Fair Swap Evaluator produces valuation comparison and fairness score');

    // 20. AI Services: Sustainability calculator
    const aiSust = await request('POST', '/api/ai/sustainability-calc', {
      garmentType: 'Jackets & Outerwear',
      material: '100% Cotton Denim',
      timesWorn: 10
    });
    assert(aiSust.status === 200 && aiSust.data.waterSavedLiters > 0 && aiSust.data.co2SavedKg > 0, 'AI Sustainability Calculator computes water, CO2 and landfill savings');

    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

  } finally {
    testServer.close();
    process.exit(failed === 0 ? 0 : 1);
  }
}

runTests().catch(err => {
  console.error('Test Suite encountered fatal error:', err);
  process.exit(1);
});
