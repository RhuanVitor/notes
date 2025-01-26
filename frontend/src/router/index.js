import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import NotesMenu from '../views/NotesMenu.vue'
import NoteDetails from '../views/NoteDetails.vue'

const routes = [
    {path: '/', component: LoginPage, name: 'LoginPage'},
    {path: '/register', component: RegisterPage, name: 'RegisterPage'},
    {path: '/notes', component: NotesMenu, name: 'NotesMenu'},
    {path: '/notes/:id', component: NoteDetails, name: 'NotesDetails'},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router