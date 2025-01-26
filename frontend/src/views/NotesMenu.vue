<template>
    <main :class="animation">
        <div class="header-box">
            <h3>NOTES</h3>
            
            <p><img src="../assets/svg/user.svg" style="height: 20px; margin-bottom: 4px; margin-right: 5px;">{{ email }}</p>
        </div>

        <ul class="list-1">
            <li v-for="note in notes" :key="note.id" class="list-item-1">
                <div @click="redirectFor(note._id)" class="text-box">
                    <h4 class="title">{{ note.title }}</h4>
                    <p class="content-text">{{ note.content }}</p>
                </div>
                <div @click="deleteNote(note._id)" class="delete-box">
                    <p>del</p>
                </div>
            </li>
        </ul>

        <div class="create-note-box">
            <div @click="createNote()" class="create-note">
                +
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios'

export default{
    data(){
        return{
            email: '',
            notes: '',
            animation: 'start-animation'
        }
    },
    methods: {
        async fecthData(){
            const token = localStorage.getItem('jwt');
            if (!token){ this.$router.push('/') }

            try{
                const response = await axios.get('http://192.168.15.130:4000/api/notes', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data)
                this.email = response.data.userEmail.split('@')[0];
                this.notes = response.data.notes;
            }catch(error){
                alert('ocorreu um erro');
                console.log(error);
            }
        },

        redirectFor(noteId){
            this.$router.push(`/notes/${noteId}`)
        },

        async createNote(){
            const token = localStorage.getItem('jwt');
            
            try{
                const response = await axios.post('http://192.168.15.130:4000/api/notes', {"title": "Sem titulo", "content": ""},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const newNoteId = response.data.noteId
                this.$router.push(`/notes/${newNoteId}`)
            }catch(error){
                alert('Ocorreu um erro');
                console.log(error);
            }
        },

        async deleteNote(noteId){
            const token = localStorage.getItem('jwt')
            try{
                await axios.delete(`http://192.168.15.130:4000/api/notes/${noteId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.fecthData()
            }catch(error){
                alert('Ocorreu um erro')
                console.log(error)
            }
        }
    },

    mounted(){
        this.fecthData();
    }
}
</script>

<style scoped>
main{
    min-height: 100vh;
    width: 100vw;
    display: flex;  
    flex-direction: column;
    align-items: center;
}

.start-animation{
    animation: fadePositionIn-3 0.3s ease-out;
}

.header-box{
    width: 90%;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 60px;
    margin-bottom: 20px;
    border-radius: 20px 20px 0px 0px;
    background: linear-gradient(to right, #d5ceff, #bab0ff);
    padding-left: 40px;
}

h3{
    font-size: 24px; 
    color: rgba(0, 0, 0, 0.75);
    font-weight: 600;
    margin: 3px;
}

p{
    font-size: 16px; 
    color: rgba(0, 0, 0, 0.75);
    font-weight: 500;
    margin: 3px;
    display: flex;
    align-items: center;
}
</style>