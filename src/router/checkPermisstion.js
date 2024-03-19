export async function checkPermissions(to, from, next) {
    const token = localStorage.getItem('token')
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!token) {
            next({path: '/login'})
        } else {
            next()
        }
    } else if (to.matched.some((record) => record.meta.onlyNotAuth)) {
        if (token) {
            next('/')
        } else {
            next()
        }
    } else {
        next()
    }
}