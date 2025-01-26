<template>
    <main>
        <form @submit.prevent="login" class="start-animation">
            <div class="title-box">
                <h1 class="title-1">Faça o login</h1>
            </div>

            <div class="input-1">
                <img src="../assets/svg/email.svg" alt="email-icon" height="25px">
                <input v-model="email" type="email" placeholder="Insira seu email">
            </div>
            
            <div class="input-1">
                <img src="../assets/svg/password.svg" alt="password-icon" height="25px" >
                <input v-model="password" type="password" placeholder="Insira sua senha">
            </div>

            <input type="submit" value="Entrar" class="btn-1">
            <div class="line"></div>
            <div class="footer">
                <p>Ainda não possui uma conta?</p><router-link to="/register">Cadastre-se</router-link>
            </div>
        </form>
    </main>
</template>

<script>
import axios from 'axios'

export default{
    data(){
        return{
            email: '',
            password: ''
        }
    },

    methods: {
        async login(){
            try{
                const email = this.email;
                const password = this.password;

                const response = await axios.post('http://192.168.15.130:4000/auth/login', { email, password })

                localStorage.setItem('jwt', response.data.token)
                this.$router.push('/notes')
            }catch(error){
                alert("Ocorreu um erro")
                console.log(error)
            }
        }
    }
}
</script>

<style scoped>
main{
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
}

.start-animation{
    animation: fadePositionIn-1 0.7s ease forwards
}
</style>