export async function verifyUser() {
  try {
    const token = localStorage.getItem('access-token');
    const res = await fetch(import.meta.process.env.VITE_BACKEND_URL, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}