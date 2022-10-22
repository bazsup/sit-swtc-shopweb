import { ref } from "vue";

export function useApi(factory, handleResponse) {
  const isLoading = ref(false);
  const result = ref(null);
  const error = ref(null);
  const execute = async (...args) => {
    const headers = {
      "Content-Type": "application/strategic-merge-patch+json",
    };
    const { url, ...request } = factory(...args);

    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(url, { ...request, headers });
      const valueResponse = await handleResponse(response);

      if (String(response.status)[0] !== "2") {
        throw valueResponse;
      }
      result.value = valueResponse;
      return valueResponse;
    } catch (e) {
      error.value = e;
      result.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    result,
    error,
    execute,
  };
}
