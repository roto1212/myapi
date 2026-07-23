<script>
    import fastapi from "../lib/api";
    import Error from "../components/Error.svelte"
    import { link, push } from "svelte-spa-router"
    import { is_login, username } from "../lib/store";
    import { marked } from "marked";
    import moment from "moment/min/moment-with-locales"
    moment.locale("ko")

    /** @type {{question_id?: string}} */
    export let params = {}
    let question_id = params.question_id
    /**
     * @typedef {{id: number, content: string, user: {username: string}, created_date: string, modified_date?: string, voter: []}} Answer
     * @typedef {{id?: number, subject?: string, content?: string|undefined, user?:{username: string}, created_date?: string, modified_date?: string, answers: Answer[], voter: []}} Question
     */

    /** @type {Question} */
    let question = {answers:[], voter: [], content: ''}
    let content = ""
    let error = {detail:[]}

    function get_question() {
        fastapi("get", "/api/question/detail/"+question_id, {}, (json) => {
            question = json
        })
    }

    get_question();

    /**
     * 
     * @param {SubmitEvent} event
     */
    function post_answer(event) {
        let url = "/api/answer/create/"+question_id
        let params = {
            content
        }
        fastapi('post', url, params, (json) => {
            content = ''
            error = {detail: []}
            get_question()
            },
            (err_json) => {
                error = err_json
            }
        )
    }

    /**
     * 
     * @param {Number|undefined} _question_id
     */
    function delete_question(_question_id) {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            let url = '/api/question/delete'
            let params = {
                question_id: _question_id
            }
            fastapi('delete', url, params,
                (json) => {
                    push('/')
                },
                (json_error) => {
                    error = json_error
                }
            )
        }
    }

    /**
     * 
     * @param{Number} answer_id
     */
    function delete_answer(answer_id) {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            let url = "/api/answer/delete"
            let params = {
                answer_id: answer_id
            }
            fastapi('delete', url, params, 
                (json) => {
                    get_question()
                },
                (json_error) => {
                    error = json_error
                }
            )
        }
    }

    /**
     * 
     * @param{Number|undefined} _question_id
     */
    function vote_question(_question_id) {
        if (window.confirm("정말로 추천하시겠습니까?")) {
            let url = "/api/question/vote"
            let params = {
                question_id: _question_id
            }
            fastapi('post', url, params,
                (json) => {
                    get_question()
                },
                (json_error) => {
                    error = json_error
                }
            )
        }
    }
    /**
     * 
     * @param{Number|undefined} answer_id
     */
    function vote_answer(answer_id) {
        if (window.confirm("정말로 추천 하시겠습니까?")) {
            let url = "/api/answer/vote"
            let params = {
                answer_id: answer_id
            }
            fastapi('post', url, params, 
                (json) => {
                    get_question()
                },
                (json_error) => {
                    error = json_error
                }
            )
        }
    }
</script>

<div class="container my-3">
    <!-- 질문 -->
    <h2 class="border-bottom py-2">
        {question.subject}
    </h2>
    <div class="card my-3">
        <div class="card-body">
            <div class="card-text">{@html marked.parse(question.content ?? '') }</div>
            <div class="d-flex justify-content-end">
                {#if question.modified_date}
                <div class="badge bg-light text-dark p-2 text-start mx-3">
                    <div class="mb-2">modified at</div>
                    <div>{moment(question.modified_date).format("YYYY년 MM월 DD일 hh:mm a")}</div>
                </div>
                {/if}
                <div class="badge bg-light text-dark p-2 text-start">
                    <div class="mb-2">{ question.user ? question.user.username : ""}</div>
                    <div>
                        {moment(question.created_date).format("YYYY년 MM월 DD일 hh:mm a")}
                    </div>
                </div>
            </div>
            <div class="my-3">
                <button type="button" class="btn btn-sm btn-outline-secondary" on:click={() => vote_question(question.id)}>
                    추천
                    <span class="badge rounded-pill bg-success">{question.voter.length}</span>
                </button>
                {#if question.user && $username === question.user.username}
                <a use:link href="/question-modify/{question_id}" class="btn btn-sm btn-outline-secondary">수정</a>
                <button type="button" class="btn btn-sm btn-outline-secondary" on:click={()=>delete_question(question.id)}>삭제</button>
                {/if}
            </div>
        </div>
    </div>
    <button class="btn btn-secondary" on:click={()=>push("/")}>목록으로</button>
    <!-- 답변목록 -->
    <h5 class="border-bottom my-3 py-2">
        {question.answers.length}개의 답변이 있습니다.
    </h5>
    {#each question.answers as answer}
        <div class="card my-3">
            <div class="card-body">
                <div class="card-text" >{@html marked.parse(answer.content ?? '') }</div>
                <div class="d-flex justify-content-end">
                    {#if answer.modified_date}
                    <div class="badge bg-light text-dark p-2 text-start mx-3">
                        <div class="mb-2">modified at</div>
                        <div>{moment(answer.modified_date).format("YYYY년 MM월 DD일 hh:mm a")}</div>
                    </div>
                    {/if}
                    <div class="badge bg-light text-dark p-2 text-start">
                        <div class="mb-2">{ answer.user ? answer.user.username : "" }</div>
                        <div>
                            {moment(answer.created_date).format("YYYY년 MM월 DD일 hh:mm a")}
                        </div>
                    </div>
                </div>
                <div class="my-3">
                    <button type="button" class="btn btn-sm btn-outline-secondary" on:click={() => vote_answer(answer.id)}>
                        추천
                        <span class="badge rounded-pill bg-success">{answer.voter.length}</span>
                    </button>
                    {#if answer.user && $username === answer.user.username}
                    <a use:link href="/answer-modify/{answer.id}" class="btn btn-sm btn-outline-secondary">수정</a>
                    <button type="button" class="btn btn-sm btn-outline-secondary" on:click={()=>delete_answer(answer.id)}>삭제</button>
                    {/if}
                </div>
            </div>
        </div>
    {/each}
    <!-- 답변등록 -->
    <Error error={error}/>
    <form method="post" class="my-3" on:submit|preventDefault={post_answer}>
        <div class="mb-3">
            <textarea rows="10" bind:value={content} class="form-control" disabled={!$is_login}></textarea>
        </div>
        <input type="submit" value="답변등록" class="btn btn-primary {$is_login ? '' : 'disabled'}">
    </form>
</div>
