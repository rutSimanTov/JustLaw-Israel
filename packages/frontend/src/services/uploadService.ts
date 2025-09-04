
export async function uploadContent(formData: FormData): Promise<void> {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('User not authenticated');
  }
  const response = await fetch('http://localhost:3001/api/upload/upload', {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Upload failed: ${errorData}`);
  }
}