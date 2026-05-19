/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
"https://atiiettvcisvexbytedj.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aWlldHR2Y2lzdmV4Ynl0ZWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNDAwNTksImV4cCI6MjA5NDcxNjA1OX0.hxE85URIUyFwzGomfr8DuBY47a8cUklvop-ZXsEOPdM";

const db =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

/* =========================
   OPEN RULES
========================= */

function openRules(){

    const name =
    document.getElementById(
        "threadName"
    ).value.trim();

    const subject =
    document.getElementById(
        "threadSubject"
    ).value.trim();

    const comment =
    document.getElementById(
        "threadComment"
    ).value.trim();

    if(!name || !subject || !comment){

        alert("Complete all fields.");

        return;
    }

    document.getElementById(
        "rulesModal"
    ).style.display = "flex";
}

/* =========================
   CREATE THREAD
========================= */

async function acceptRules(){

    const author =
    document.getElementById(
        "threadName"
    ).value.trim();

    const title =
    document.getElementById(
        "threadSubject"
    ).value.trim();

    const content =
    document.getElementById(
        "threadComment"
    ).value.trim();

    const { error } =
    await db

    .from("threads")

    .insert([{

        author,
        title,
        content

    }]);

   if(error){
   
       console.error(error);
   
       alert(error.message);
   
       return;
   }

    document.getElementById(
        "threadName"
    ).value = "";

    document.getElementById(
        "threadSubject"
    ).value = "";

    document.getElementById(
        "threadComment"
    ).value = "";

    document.getElementById(
        "rulesModal"
    ).style.display = "none";

    loadThreads();
}

/* =========================
   LOAD THREADS
========================= */

async function loadThreads(){

    const { data, error } =
    await db

    .from("threads")

    .select("*")

    .order("created_at", {

        ascending:false

    });

    if(error){

        console.error(error);

        return;
    }

    renderThreads(data);
}

/* =========================
   ADD REPLY
========================= */

async function addReply(threadId){

    const author =
    document.getElementById(
        `replyName-${threadId}`
    ).value.trim();

    const message =
    document.getElementById(
        `replyMessage-${threadId}`
    ).value.trim();

    if(!author || !message){

        alert("Complete all fields.");

        return;
    }

    const { error } =
    await db

    .from("replies")

    .insert([{

        thread_id:threadId,

        author,

        message

    }]);

    if(error){

        console.error(error);

        return;
    }

    loadThreads();
}

/* =========================
   RENDER THREADS
========================= */

async function renderThreads(threads){

    const board =
    document.getElementById("board");

    board.innerHTML = "";

    for(const thread of threads){

        const { data: replies } =
        await db

        .from("replies")

        .select("*")

        .eq("thread_id", thread.id)

        .order("created_at", {

            ascending:true

        });

        const repliesHTML =
        replies.map(reply => `

            <div class="reply">

                <div class="replyAuthor">

                    ${reply.author}

                </div>

                <div class="replyMessage">

                    ${reply.message}

                </div>

            </div>

        `).join("");

        board.innerHTML += `

            <div class="thread">

                <div class="threadHeader">

                    <span class="threadSubject">

                        ${thread.title}

                    </span>

                    <span class="threadMeta">

                        Posted by
                        ${thread.author}

                    </span>

                </div>

                <div class="threadContent">

                    ${thread.content}

                </div>

                <div class="replies">

                    ${repliesHTML}

                    <input
                    type="text"
                    id="replyName-${thread.id}"
                    placeholder="Name"
                    >

                    <textarea
                    id="replyMessage-${thread.id}"
                    placeholder="Reply..."
                    ></textarea>

                    <button
                    onclick="addReply(${thread.id})"
                    >

                    Reply

                    </button>

                </div>

            </div>

        `;
    }
}

/* =========================
   START
========================= */

loadThreads();
