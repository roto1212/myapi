<script>
    import {push} from 'svelte-spa-router'
    import fastapi from '../lib/api';
    import Error from '../components/Error.svelte';

    /** @type {{detail: string | {loc: string[], msg: string}[]}} */
    let error = {detail: []}
    /** @type {string} */
    let subject = ''
    /** @type {string} */
    let content = ''

    /**
     * 질문 등록 폼을 제출해 질문을 생성하고, 성공 시 목록 페이지로 이동한다.
     * @created 26-07-21 선대범
     * @example
     * <form on:submit|preventDefault={post_question}>
     */
    function post_question() {
        let url = "/api/question/create"
        let params = {
            subject, content
        }
        fastapi('post', url, params,
            (json) => {
                push("/")
            },
            (json_error) => {
                error = json_error
            }
        )
    }
</script>

<div class="container">
    <h5 class="my-3 border-bottom pb-2">질문등록</h5>
    <Error error={error}/>
    <form class="my-3" method="post" on:submit|preventDefault={post_question}>
        <div class="mb-3">
            <label for="subject">제목</label>
            <input type="text" class="form-control" bind:value="{subject}">
        </div>
        <div class="mb-3">
            <label for="content">내용</label>
            <textarea class="form-control" rows="10" bind:value={content}></textarea>
        </div>
        <button class="btn btn-primary">저장하기</button>
    </form>
</div>