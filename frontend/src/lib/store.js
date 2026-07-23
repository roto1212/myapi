import { writable } from "svelte/store";

/**
 * localStorage와 동기화되는 Svelte writable 스토어를 생성한다.
 * 최초 호출 시 localStorage에 저장된 값이 있으면 그 값으로, 없으면 initValue로 초기화하고,
 * 이후 스토어 값이 바뀔 때마다(subscribe) localStorage에 자동 저장한다.
 * @template T
 * @param {string} key - localStorage에 사용할 키
 * @param {T} initValue - localStorage에 값이 없을 때 사용할 초기값
 * @returns {import('svelte/store').Writable<T>} 값 변경 시 localStorage에 자동 반영되는 writable 스토어
 * @created 26-07-21 선대범
 * @example
 * export const page = persist_storage("page", 0);
 * 사용처: $page (읽기), $page = 1 (쓰기 → localStorage에도 자동 반영)
 */
const persist_storage = (key, initValue) => {
    const storedValueStr = localStorage.getItem(key);
    const store = writable(
        storedValueStr != null ? JSON.parse(storedValueStr) : initValue,
    );
    store.subscribe((val) => {
        localStorage.setItem(key, JSON.stringify(val));
    });
    return store;
};

export const page = persist_storage("page", 0);
export const keyword = persist_storage("keyword", "");
export const access_token = persist_storage("access_token", "");
export const username = persist_storage("username", "");
export const is_login = persist_storage("is_login", false);
