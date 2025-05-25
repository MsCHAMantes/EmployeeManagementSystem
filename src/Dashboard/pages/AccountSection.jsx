import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountSection = () => {
  const [account, setAccount] = useState(null);
  const userId = localStorage.getItem('user_id'); 

  useEffect(() => {
    axios.get(`http://localhost/employeems/get_account.php?id=${userId}`)
      .then(res => setAccount(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  if (!account) {
    return <p>Loading account information...</p>;
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Account Information</h2>
      <ul className="space-y-2 text-gray-700">
        <li><strong>Full Name:</strong> {account.fullname}</li>
        <li><strong>Email:</strong> {account.email}</li>
        <li><strong>Contact Number:</strong> {account.number}</li>
        <li><strong>Address:</strong> {account.address}</li>
        <li><strong>Age:</strong> {account.age}</li>
        <li><strong>Gender:</strong> {account.gender}</li>
        <li><strong>Birthday:</strong> {account.birthday}</li>
        <li><strong>School (College):</strong> {account.school}</li>
        <li><strong>College Degree:</strong> {account.college_degree}</li>
        <li><strong>Date of Hire:</strong> {account.date_of_hire}</li>
      </ul>
    </div>
  );
};

export default AccountSection;
