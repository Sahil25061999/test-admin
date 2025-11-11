#!/usr/bin/env node

/**
 * API Migration Testing Script
 * 
 * This script tests all the migrated API endpoints to ensure they work correctly
 * Run with: node scripts/test-api-migration.js
 */

const https = require('https');
const http = require('http');

class ApiTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async testEndpoint(method, path, data = null, description = '') {
    const url = `${this.baseUrl}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    return new Promise((resolve) => {
      const req = (url.startsWith('https') ? https : http).request(url, options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            const result = {
              path,
              method,
              status: res.statusCode,
              success: res.statusCode >= 200 && res.statusCode < 300,
              data: parsedData,
              description,
            };
            
            this.results.push(result);
            console.log(`✅ ${method} ${path} - ${res.statusCode} ${description}`);
            resolve(result);
          } catch (error) {
            const result = {
              path,
              method,
              status: res.statusCode,
              success: false,
              error: 'Failed to parse response',
              description,
            };
            
            this.results.push(result);
            console.log(`❌ ${method} ${path} - Parse Error ${description}`);
            resolve(result);
          }
        });
      });

      req.on('error', (error) => {
        const result = {
          path,
          method,
          status: 0,
          success: false,
          error: error.message,
          description,
        };
        
        this.results.push(result);
        console.log(`❌ ${method} ${path} - Network Error: ${error.message} ${description}`);
        resolve(result);
      });

      if (data && method !== 'GET') {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async runTests() {
    console.log('🚀 Starting API Migration Tests...\n');

    // Test authentication endpoints
    await this.testEndpoint('POST', '/api/auth/send-otp', {
      countryCode: '91',
      phone: '1234567890'
    }, 'Send OTP');

    // Test user endpoints
    await this.testEndpoint('GET', '/api/users?page=1&limit=10', null, 'Get Users');
    await this.testEndpoint('GET', '/api/user/1234567890?type=profile', null, 'Get User Profile');
    await this.testEndpoint('GET', '/api/user/1234567890?type=wallet', null, 'Get User Wallet');

    // Test transaction endpoints
    await this.testEndpoint('GET', '/api/transactions?url=/admin/v1/buy-metal/txn-info&txn_type=BUY&limit=10', null, 'Get Transactions');

    // Test redemption endpoints
    await this.testEndpoint('GET', '/api/redemption?action=process', null, 'Process Redemption');
    await this.testEndpoint('GET', '/api/redemption?action=execute&product_name=GOLD24&txn_id=test123&new_status=SUCCESS', null, 'Execute Redemption');

    // Test deposit endpoints
    await this.testEndpoint('POST', '/api/deposit', {
      amount: 1000,
      phone: '1234567890',
      notes: 'Test deposit',
      type: 'gold'
    }, 'Deposit Gold');

    // Test data endpoints
    await this.testEndpoint('GET', '/api/data?action=prices&product=24KGOLD', null, 'Get Prices');
    await this.testEndpoint('GET', '/api/data?action=convert&block_id=1&price_type=buy&input_val=1000&input_type=amt', null, 'Convert Amount');

    // Test discount endpoints
    await this.testEndpoint('POST', '/api/discount', {
      type: 'offer',
      name: 'Test Offer',
      discount_percentage: 10,
      expiry_date: '2024-12-31 23:59:59'
    }, 'Create Offer');

    await this.testEndpoint('POST', '/api/discount', {
      type: 'voucher',
      voucher_code: 'TEST123',
      gold_qty: 1
    }, 'Create Voucher');

    // Test invoice endpoints
    await this.testEndpoint('GET', '/api/invoices/test123', null, 'Get Invoice');

    // Test UPI endpoints
    await this.testEndpoint('GET', '/api/upis?phone=1234567890', null, 'Get UPIs');

    this.printResults();
  }

  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');

    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    const failed = total - passed;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`  - ${result.method} ${result.path}: ${result.error || result.data?.message || 'Unknown error'}`);
        });
    }

    console.log('\n✅ All Tests Completed!');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new ApiTester();
  tester.runTests().catch(console.error);
}

module.exports = ApiTester; 