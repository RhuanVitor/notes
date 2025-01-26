<template>
    <main>
        <div class="note-detail" :class="animation">
            <div class="edit-area">
                <div @click="redirectBack()" to="/notes" class="back">
                    <img src="../assets/svg/arrowLeft.svg" alt="" height="50px">
                </div>
                <input @input="updateData()" v-model="title" class="title-note">
                <textarea ref="textarea" @input="updateData()" v-model="content" class="content-note"></textarea>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios'

export default{
    data(){
        return{
            title: '',
            content: '',
            animation: 'start-animation'
        }
    },

    methods: {
        async fetchData(){
            const token = localStorage.getItem('jwt');
            if (!token){ this.$router.push('/') }

            try{
                const noteId = this.$route.params.id

                const response = await axios.get(`http://192.168.15.130:4000/api/notes/${noteId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                this.title = response.data.note.title;
                this.content = response.data.note.content

                setTimeout(() => {this.updateHeight()}, 1)
            }catch(error){
                alert('Ocorreu um erro');
                console.log(error)
            }
        },

        async updateData(){
            const token = localStorage.getItem('jwt');
            const noteId = this.$route.params.id
            const title = this.title
            const content = this.content

            try{
                await axios.put(`http://192.168.15.130:4000/api/notes/${noteId}`, { title, content }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                this.updateHeight()
            } catch(error){
                alert('Ocorreu um erro')
                console.log(error)
            }
        },

        updateHeight(){
            const textarea = this.$refs.textarea
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        },

        redirectBack(){
            this.animation = "end-animation";
            setTimeout(() => {
                this.$router.push('/notes')
            }, 300)
        }
    },
    
    mounted() {
    this.fetchData()
}
}
</script>
<style scoped>
main{
    height: 100vh;
    max-width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
}

.note-detail{
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 60px;
}

.start-animation{
    animation: fadePositionIn-2 0.3s ease forwards
}

.end-animation{
    animation: fadePositionOut-1 0.3s ease-in
}
</style>