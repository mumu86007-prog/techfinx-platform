#!/usr/bin/env node

/**
 * TechfinX Backend API 启动脚本
 * 用于生产环境启动服务器
 */

const path = require('path');
const fs = require('fs');

// 检查Node.js版本
const nodeVersion = process.version;
const requiredVersion = '18.0.0';
const currentVersion = nodeVersion.substring(1).split('.').map(Number);

if (currentVersion[0] < 18) {
  console.error('❌ Node.js版本过低');
  console.error(`   当前版本: ${nodeVersion}`);
  console.error(`   要求版本: >= ${requiredVersion}`);
  process.exit(1);
}

// 检查环境变量文件
const envFile = path.join(__dirname, '.env');
if (!fs.existsSync(envFile)) {
  console.error('❌ 环境变量文件不存在');
  console.error('   请复制 env.example 为 .env 并配置必要的环境变量');
  process.exit(1);
}

// 检查必要的环境变量
require('dotenv').config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ 缺少必要的环境变量:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  process.exit(1);
}

// 启动服务器
console.log('🚀 启动 TechfinX Backend API...');
console.log(`📍 环境: ${process.env.NODE_ENV || 'development'}`);
console.log(`⏰ 时间: ${new Date().toLocaleString()}`);

// 导入并启动服务器
require('./src/server.js');
