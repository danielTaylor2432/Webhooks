const axios = require('axios');

module.exports = async function (context, req) {
    context.log('HTTP trigger function processed a request.');

    const discordData = req.body; // Data from Discord webhook

    if (discordData.type === 'ticket_created') {
        // Constructing the task name and description using multiple fields
        const taskName = discordData['create.form.2'];  // Assuming this contains the task name THIS IS EMAIL
        // Concatenate multiple fields into the task description
        const taskDescription = [
            `ID: ${discordData['create.form.1']}`, // Assuming this contains some ID
            `Name: ${discordData['create.form.3']}`, // Assuming this contains the user's name
            `Phone: ${discordData['create.form.4']}`, // Assuming this contains the phone number
            `Description: ${discordData['create.form.5']}` // Additional description
        ].join('\n');
    //This is for testing.
        // Call Asana API to create a new task with the extracted information
        try {
            await createTaskInAsana(taskName, taskDescription);
            context.res = {
                status: 200, // Success response
                body: "Task successfully created in Asana"
            };
        } catch (error) {
            context.res = {
                status: 500, // Internal Server Error
                body: `Failed to create task in Asana due to an error: ${error.message}`
            };
        }
    } else {
        context.res = {
            status: 400, // Bad Request
            body: "Invalid request type"
        };
    }
};

async function createTaskInAsana(name, description) {
    const asanaUrl = 'https://app.asana.com/api/1.0/tasks';
    const asanaToken = '2/1206047328391975/1207174572474795:8a3947f0fa1e4e0f814d8e814b683db2'; // Securely store and retrieve your token

    const headers = {
        'Authorization': `Bearer ${asanaToken}`,
        'Content-Type': 'application/json'
    };
    const data = {
        "data": {
            "name": name,
            "notes": description,
            "workspace": "978674317228910", // Find your workspace ID in Asana
            "projects": ["1207174512780120"] // Optional: Specify if the task belongs to a project
        }
    };

    try {
        const response = await axios.post(asanaUrl, data, { headers });
        context.log('Task created in Asana:', response.data);
    } catch (error) {
        context.log('Error creating task in Asana:', error.response.data);
        throw error;
    }
}
