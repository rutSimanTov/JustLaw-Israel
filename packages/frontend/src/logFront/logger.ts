import axios from "axios";

export async function logErrorToServer(service: string, level: string, message: string, exception: string): Promise<void> {
   debugger
    const token = localStorage.getItem('jwtToken');

    try {
        const response = await axios.post('http://localhost:3001/api/logger', {
            service: service,
            level: level,
            message: message,
            exception: exception
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Error logged successfully:', response.data);
    } catch (error) {
        console.error('Error logging error:', error);
    }
}
