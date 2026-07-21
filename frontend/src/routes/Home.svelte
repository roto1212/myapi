<script>
    import fastapi from "../lib/api";
    import { link } from 'svelte-spa-router'

    /**
     * @type
     * {{id: number, subject: string, content: string, created_date: string}[]}
     */
    let question_list = [];

    function get_question_list() {
        fastapi('get', '/api/question/list', {}, (json) => {
            question_list = json
        })
    }

    get_question_list()
</script>

<div class="container my-3">
    <table class="table">
        <thead>
            <tr class="table-dark">
                <th>번호</th>
                <th>제목</th>
                <th>작성일시</th>
            </tr>
        </thead>
        <tbody>
            {#each question_list as question, i}
            <tr>
                <td>{i+1}</td>
                <td>
                    <a use:link href="/detail/{question.id}">{question.subject}</a>
                </td>
                <td>{question.created_date}</td>
            </tr>
            {/each}
        </tbody>
    </table>
    <a href="/question-create" use:link class="btn btn-primary">질문하기</a>
</div>