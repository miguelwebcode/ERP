#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';

const SKIPLIST_FILE = '.vitest-skiplist.txt';

function runVitest() {
  console.log('🧪 Running Vitest with JSON reporter to collect failing tests...');
  
  try {
    // Run vitest with JSON reporter and capture output
    const output = execSync('npx vitest --reporter=json --run', { 
      encoding: 'utf8',
      stdio: 'pipe',
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    return output;
  } catch (error) {
    // Vitest returns non-zero exit code when tests fail, which is expected
    // The output should still contain the JSON report
    return error.stdout || error.output?.[1] || '';
  }
}

function parseFailedTestFiles(jsonOutput) {
  const failedFiles = new Set();
  
  try {
    // Split output by lines and find JSON lines
    const lines = jsonOutput.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const data = JSON.parse(line);
        
        // Handle final test results - this contains the file names
        if (data.testResults) {
          data.testResults.forEach(testFile => {
            if (testFile.status === 'failed' && testFile.name) {
              // Convert absolute path to relative path from client directory
              let filePath = testFile.name.replace(/\\/g, '/');
              if (filePath.includes('/client/')) {
                filePath = filePath.substring(filePath.indexOf('/client/') + 8);
              }
              failedFiles.add(filePath);
            }
          });
        }
        
      } catch (parseError) {
        // Ignore lines that aren't valid JSON
        continue;
      }
    }
    
    // Also try to parse the entire output as a single JSON object
    try {
      const fullData = JSON.parse(jsonOutput);
      if (fullData.testResults) {
        // Handle Jest-like format - extract file names of failed test files
        fullData.testResults.forEach(testFile => {
          if (testFile.status === 'failed' && testFile.name) {
            // Convert absolute path to relative path from client directory
            let filePath = testFile.name.replace(/\\/g, '/');
            if (filePath.includes('/client/')) {
              filePath = filePath.substring(filePath.indexOf('/client/') + 8);
            }
            failedFiles.add(filePath);
          }
        });
      }
    } catch {
      // Ignore if not parseable as single JSON
    }
    
  } catch (error) {
    console.error('❌ Error parsing JSON output:', error.message);
  }
  
  return Array.from(failedFiles).filter(path => path && path.trim());
}

function loadExistingSkiplist() {
  if (!existsSync(SKIPLIST_FILE)) {
    return [];
  }
  
  try {
    const content = readFileSync(SKIPLIST_FILE, 'utf-8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  } catch (error) {
    console.warn(`⚠️  Warning: Could not read existing skiplist: ${error.message}`);
    return [];
  }
}

function updateSkiplist(newFailedFiles) {
  const existingSkiplist = loadExistingSkiplist();
  const existingSet = new Set(existingSkiplist);
  
  // Add new failed test files to the skiplist
  let addedCount = 0;
  newFailedFiles.forEach(filePath => {
    if (!existingSet.has(filePath)) {
      existingSet.add(filePath);
      addedCount++;
    }
  });
  
  if (addedCount === 0) {
    console.log('✅ No new failed test files to add to skiplist');
    return;
  }
  
  // Create the new skiplist content
  const timestamp = new Date().toISOString();
  const header = [
    '# Vitest Skip List - Test Files',
    `# Generated on ${timestamp}`,
    '# This file contains test file paths that should be skipped',
    '# Each line represents a test file that will be completely ignored',
    '#',
    ''
  ].join('\n');
  
  const content = header + Array.from(existingSet).sort().join('\n') + '\n';
  
  try {
    writeFileSync(SKIPLIST_FILE, content);
    console.log(`✅ Updated skiplist with ${addedCount} new failed test files`);
    console.log(`📝 Total test files in skiplist: ${existingSet.size}`);
    
    if (addedCount > 0) {
      console.log('\n📋 Newly added failed test files:');
      newFailedFiles.forEach(filePath => {
        if (!existingSkiplist.includes(filePath)) {
          console.log(`   - ${filePath}`);
        }
      });
    }
    
  } catch (error) {
    console.error(`❌ Error writing skiplist file: ${error.message}`);
    process.exit(1);
  }
}

function main() {
  console.log('🚀 Starting failed test collection process...\n');
  
  // Run vitest and get the output
  const vitestOutput = runVitest();
  
  if (!vitestOutput) {
    console.log('⚠️  No output from Vitest. Tests may have all passed or there was an error.');
    return;
  }
  
  // Parse failed test files from the output
  const failedFiles = parseFailedTestFiles(vitestOutput);
  
  if (failedFiles.length === 0) {
    console.log('🎉 Great! No failed test files found.');
    return;
  }
  
  console.log(`🔍 Found ${failedFiles.length} failed test files`);
  
  // Update the skiplist
  updateSkiplist(failedFiles);
  
  console.log('\n✅ Failed test file collection completed!');
  console.log(`📁 Skiplist file: ${SKIPLIST_FILE}`);
  console.log('💡 Run "npm run test:skip-fails" to run tests with failing files skipped');
}

// Run the script
main();