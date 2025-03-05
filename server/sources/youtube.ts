async function fetchYouTubeData() {
  const keywords = ["news", "views", "global"]; // 类似于中文网站的频道关键词

  const youtubeResults = await Promise.all(
    keywords.map(async (keyword) => {
      const searchResults = await Youtube({ query: `${keyword} recent videos`, result_type: "VIDEO" });
      return searchResults;
    })
  );

  const processedResults = youtubeResults
    .flat() // 将多个搜索结果列表合并为一个列表
    .map((item) => {
      if (item.result_type === "VIDEO") {
        return {
          id: item.video_id, // 提取视频ID
          title: item.title,
          extra: {
            date: item.publish_date, // YouTube 返回的就是 UTC 时间，无需转换
          },
          url: item.url,
        };
      }
      return null; // 过滤掉非视频结果
    })
    .filter(item => item !== null) // 移除 null 值
    .sort((m, n) => (m.extra.date < n.extra.date ? 1 : -1)); // 按照日期降序排列

  return processedResults;
}

export default defineSource(async () => {
  return await fetchYouTubeData();
});
