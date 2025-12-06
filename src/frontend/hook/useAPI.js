export function useApi(accessToken, saveToken) {
  const call = (url, options = {}) => {
    return apiClient(url, accessToken, {
      ...options,
      onRefresh: saveToken, // <-- cập nhật token mới cho client
    });
  };
  return { call };
}
