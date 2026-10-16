// ---------- localStorage 持久化工具 ----------
// 各 Store 在初始化时 loadJSON 读取上次保存的数据（刷新页面不丢失），
// 在 actions 修改数据后 saveJSON 写回 localStorage。
// JSON 序列化要求存储的数据必须是纯 JSON 数据（对象 / 数组 / 基础类型），
// 不能包含函数、Date 等无法序列化的内容。

// 读取：key 不存在或解析失败时返回兜底值 fallback
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

// 写入：把数据序列化成 JSON 字符串保存
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export { loadJSON, saveJSON }
