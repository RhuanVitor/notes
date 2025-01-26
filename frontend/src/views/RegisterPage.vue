<template>
    <main>
        <form @submit.prevent="register" class="start-animation">
            <div class="title-box">
                <h1 class="title-1">Crie sua conta</h1>
            </div>

            <div class="input-1">
                <img src="../assets/svg/email.svg" alt="email-icon" height="25px">
                <input v-model="email" type="email" placeholder="Insira seu email">
            </div>
            
            <div class="input-1">
                <img src="../assets/svg/password.svg" alt="password-icon" height="25px" >
                <input v-model="password" type="password" placeholder="Crie uma senha">
            </div>

            <div class="input-1">
                <img src="../assets/svg/password.svg" alt="password-icon" height="25px">
                <input v-model="confirmPassword" type="password" placeholder="Confirmar senha">
            </div>

            <input type="submit" value="Cadastrar" class="btn-1">
            <div class="line"></div>
            <div class="footer">
                <p>Já possui uma conta?</p><router-link to="/">Faça o login</router-link>
            </div>
        </form>
    </main>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            email: '',
            password: '',
            confirmPassword: ''
        }
    },

    methods: {
        async register(){
            try{
                const email = this.email;
                const password = this.password;
                const confirm_password = this.confirmPassword
                
                const response = await axios.post('http://192.168.15.130:4000/auth/signup', { email, password, confirm_password })
                
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