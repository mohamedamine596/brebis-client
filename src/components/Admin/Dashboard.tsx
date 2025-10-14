import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div>
                <h2>Key Metrics</h2>
                {/* Display key metrics here */}
            </div>
            <div>
                <h2>Management Options</h2>
                <ul>
                    <li><a href="/admin/users">Manage Users</a></li>
                    <li><a href="/admin/investments">Manage Investments</a></li>
                    {/* Add more management options as needed */}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;