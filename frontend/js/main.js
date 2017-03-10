import './helpers';
import svg4everybody from 'svg4everybody';

/* HMR */
if (module.hot) module.hot.accept();

document.addEventListener('DOMContentLoaded', () => {
    svg4everybody();

    /**
     * Async demonstration
     */
    const mockFetch = (delay) => {
        return new Promise(resolve => {
            setTimeout(() => resolve('READY'), delay);
        });
    };

    /* async/await */
    async function fetchUser() {
        const user = await mockFetch(2000);
        cl('1 - Await ', user);
    }
    fetchUser();

    /* Promise usage */
    mockFetch(1500)
        .then(data => cl('2 - Promise ', data));

    cl('3 - Synchronous');
});
