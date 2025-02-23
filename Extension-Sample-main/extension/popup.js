document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user') || 'Guest';
  document.getElementById('user').textContent = user;

  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.close();
  });
});
