import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});


export const getTickets = async () => {
  try {
    const response = await api.get('/all_tickets');
    return response.data.map((ticket, index) => ({
      id: ticket.id,
      title: ticket.title || 'Untitled Ticket',
      description: ticket.description || '',
      status: ticket.status || 'New',
      category: ticket.category || 'General',
      priority: ticket.priority || 'low',
      draft_response: ticket.draft_response || '',
      confidence_score: ticket.confidence_score || 0.00,
      created_at: new Date(Date.now() - index * 3600000).toISOString()
    }));
  } catch (error) {
    console.error('Failed to get tickets:', error);
    throw error;
  }
};

export const getTicketDetails = async (id) => {
  try {
    const response = await api.get(`/ticket_details/${id}`);
    const ticket = response.data;
    if (!ticket) return null;
    return {
      id: ticket.id,
      title: ticket.title || 'Untitled Ticket',
      description: ticket.description || '',
      status: ticket.status || 'New',
      category: ticket.category || 'General',
      priority: ticket.priority || 'low',
      draft_response: ticket.draft_response || '',
      confidence_score: ticket.confidence_score || 0.00,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Failed to get ticket details for #${id}:`, error);
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    // 1. Fetch current users
    let users = [];
    try {
      const usersRes = await api.get('/users');
      users = usersRes.data || [];
    } catch (e) {
      console.warn("Could not load users list");
    }

    let userId = null;
    if (users.length > 0) {
      // Pick first user or match by customerId
      const matched = users.find(u => String(u.id) === String(ticketData.customerId) || u.email === ticketData.customerId);
      userId = matched ? matched.id : users[0].id;
    }

    // 2. If no users exist, auto-create a default agent/user
    if (!userId) {
      try {
        const createRes = await api.post('/create_user', {
          name: 'Demo Agent',
          mobile_number: '555-0199',
          email: 'agent@ticketflow.ai',
          password: 'securepassword'
        });
        const usersRes = await api.get('/users');
        if (usersRes.data && usersRes.data.length > 0) {
          userId = usersRes.data[0].id;
        }
      } catch (err) {
        console.error("Auto-user creation failed:", err);
      }
    }

    // 3. Fallback user_id if all fails
    if (!userId) {
      userId = 1;
    }

    // 4. Construct payload for backend /create_ticket
    const payload = {
      user_id: userId,
      title: ticketData.subject || 'New Ticket',
      description: ticketData.description || ''
    };

    const response = await api.post('/create_ticket', payload);
    if (response.data && response.data.status === 'error') {
      throw new Error(response.data.message || 'Unknown backend error occurred');
    }
    return response.data;
  } catch (error) {
    console.error('Failed to create ticket:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export default api;
