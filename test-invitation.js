// Test script for user invitation
const axios = require('axios');

// Replace with your actual JWT token for an admin user
const adminToken = 'YOUR_ADMIN_JWT_TOKEN';

// API base URL - adjust as needed
const baseUrl = 'http://localhost:5000/api/v1';

// Test invitation for a student
async function testStudentInvitation() {
  try {
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        data: {
          email: 'student@example.com',
          name: 'Test Student',
          roles: ['STUDENT'],
          departmentId: 'DEPARTMENT_UUID', // Replace with actual UUID
          semesterId: 'SEMESTER_UUID', // Replace with actual UUID
          courseId: 'COURSE_UUID', // Replace with actual UUID
        },
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Student invitation response:');
    console.log(JSON.stringify(response.data, null, 2));

    // Save the temporary password for login test
    return {
      email: 'student@example.com',
      tempPassword: response.data.data.tempPassword,
    };
  } catch (error) {
    console.error(
      'Error inviting student:',
      error.response?.data || error.message
    );
  }
}

// Test invitation for a teacher
async function testTeacherInvitation() {
  try {
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        data: {
          email: 'teacher@example.com',
          name: 'Test Teacher',
          roles: ['TEACHER'],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Teacher invitation response:');
    console.log(JSON.stringify(response.data, null, 2));

    return {
      email: 'teacher@example.com',
      tempPassword: response.data.data.tempPassword,
    };
  } catch (error) {
    console.error(
      'Error inviting teacher:',
      error.response?.data || error.message
    );
  }
}

// Test login with invited user
async function testInvitedUserLogin(email, password) {
  try {
    const response = await axios.post(
      `${baseUrl}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Login response:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
  }
}

// Test setup invited user (set permanent password)
async function testSetupInvitedUser(email, tempPassword, newPassword) {
  try {
    // First login with temporary password
    const loginResponse = await testInvitedUserLogin(email, tempPassword);

    if (!loginResponse) {
      console.error('Login failed, cannot complete setup');
      return;
    }

    // Use the setup endpoint to set a permanent password
    const response = await axios.post(
      `${baseUrl}/auth/invited/setup`,
      {
        email,
        password: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${loginResponse.data.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Setup response:');
    console.log(JSON.stringify(response.data, null, 2));

    // Try logging in with the new password
    await testInvitedUserLogin(email, newPassword);
  } catch (error) {
    console.error(
      'Error setting up invited user:',
      error.response?.data || error.message
    );
  }
}

// Run the tests
async function runTests() {
  console.log('=== Testing User Invitation System ===');

  // Test student invitation
  const student = await testStudentInvitation();

  // Test teacher invitation
  const teacher = await testTeacherInvitation();

  if (student) {
    console.log('\n=== Testing Student Login with Temporary Password ===');
    await testInvitedUserLogin(student.email, student.tempPassword);

    console.log('\n=== Testing Student Setup (Setting Permanent Password) ===');
    await testSetupInvitedUser(
      student.email,
      student.tempPassword,
      'NewSecurePassword123!'
    );
  }

  if (teacher) {
    console.log('\n=== Testing Teacher Login with Temporary Password ===');
    await testInvitedUserLogin(teacher.email, teacher.tempPassword);

    console.log('\n=== Testing Teacher Setup (Setting Permanent Password) ===');
    await testSetupInvitedUser(
      teacher.email,
      teacher.tempPassword,
      'TeacherPassword456!'
    );
  }
}

runTests();
