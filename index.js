const axios = require('axios');

module.exports = async function (context, req) {
    context.log('HTTP trigger function processed a request.');

    const discordData = req.body; // Data from Discord webhook

    if (discordData.type === 'ticket_created') {
        // Dynamically building task details
        const ekiID = discordData['create.form.1'];
        const ekuEmail = discordData['create.form.2'];
        const lastFirst = discordData['create.form.3'];
        const phone = discordData['create.form.4'];
        const taskDescription = discordData['create.form.5'];

        // Call Asana API to create a new task with the extracted information
        await createTaskInAsana(taskName, taskDescription);
    }

    context.res = {
        status: 200, // Success response
        body: "Processed Discord Webhook"
    };
};

async function createTaskInAsana(name, description) {
    const asanaUrl = 'https://app.asana.com/api/1.0/tasks';
    const asanaToken = 'your_asana_access_token'; // Securely store and retrieve your token

    const headers = {
        'Authorization': `Bearer ${asanaToken}`,
        'Content-Type': 'application/json'
    };

    const data = {
        "data": {
            "name": name,
            "notes": description,
            "workspace": "your_workspace_id",  // Find your workspace ID in Asana
            "projects": ["your_project_id"]   // Optional: Specify if the task belongs to a project
        }
    };

    try {
        const response = await axios.post(asanaUrl, data, { headers });
        context.log('Task created in Asana:', response.data);
    } catch (error) {
        context.log('Error creating task in Asana:', error.response.data);
        throw error;
    }
};
