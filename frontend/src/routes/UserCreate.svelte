<script>
    import {push} from 'svelte-spa-router'
    import fastapi from '../lib/api';
    import Error from '../components/Error.svelte';

    /** @type {{detail: string | {loc: string[], msg: string}[]}} */
    let error = {detail: []}
    /** @type {string} */
    let username = ''
    /** @type {string} */
    let password1 = ''
    /** @type {string} */
    let password2 = ''
    /** @type {string} */
    let email = ''

    /**
     * 회원가입 폼을 제출해 사용자를 생성하고, 성공 시 로그인 페이지로 이동한다.
     * @created 26-07-21 선대범
     * @example
     * <form on:submit|preventDefault={post_user}>
     */
    function post_user() {
        let url = "/api/user/create"
        let params = {
            username: username,
            password1: password1,
            password2: password2,
            email: email,
        }
        fastapi('post', url, params, 
            (json) => {
                push('/user-login')
            },
            (json_error) => {
                error = json_error
            }
        )
    }
</script>

<div class="container">
    <h5 class="my-3 border-bottom pb-2">회원가입</h5>
    <Error error={error}/>
    <form method="post" on:submit|preventDefault={post_user}>
        <div class="mb-3">
            <label for="username">사용자 이름</label>
            <input type="text" class="form-control" id="username" bind:value={username}>
        </div>
        <div class="mb-3">
            <label for="password1">비밀번호</label>
            <input type="text" class="form-control" id="password1" bind:value={password1}>
        </div>
        <div class="mb-3">
            <label for="password2">비밀번호 확인</label>
            <input type="text" class="form-control" id="password2" bind:value={password2}>
        </div>
        <div class="mb-3">
            <label for="email">이메일</label>
            <input type="text" class="form-control" id="email" bind:value={email}>
        </div>
        <button type="submit" class="btn btn-primary">생성하기</button>
    </form>
</div>