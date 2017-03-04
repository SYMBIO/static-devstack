import './helpers';
import svg4everybody from 'svg4everybody';

/* HMR */
if (module.hot) module.hot.accept();

document.addEventListener('DOMContentLoaded', () => {
    svg4everybody();

    /**
     * async/await
     * DELETE this code
     */
    const mockFetch = () => {
        return new Promise(resolve => {
            setTimeout(() => resolve('READY'), 2000);
        });
    };

    async function fetchUser() {
        const user = await mockFetch();
        cl(user);
    }
    fetchUser();
});
