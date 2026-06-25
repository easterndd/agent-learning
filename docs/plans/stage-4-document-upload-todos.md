# 阶段 4 预习 TODO：文档上传与 chunk

这份 TODO 留给你后续手敲阶段 4。建议先只支持 `.txt` 和 `.md`，跑通后再加 CSV/PDF。

## 后端 TODO

### 1. Document repository

文件建议：

- `backend/app/repositories/documents.py`

需要方法：

- `list_by_knowledge_base(knowledge_base_id)`
- `get_active(document_id)`
- `add(document)`
- `add_chunks(chunks)`

### 2. 文件存储 adapter

文件建议：

- `backend/app/infrastructure/storage/local_file_storage.py`

先实现：

```python
def save_upload(file: UploadFile) -> tuple[str, int]:
    # TODO: 生成安全文件名，保存到 storage/uploads/
    # TODO: 返回 storage_path 和 file_size
```

学习点：

- API 层不要直接拼文件路径。
- 存储策略独立出来，未来可以换 S3/OSS。

### 3. 文本解析

文件建议：

- `backend/app/modules/documents/application/parsers.py`

先实现：

```python
def parse_text_file(path: Path) -> str:
    # TODO: 按 utf-8 读取 txt/md
```

后续再补：

- CSV 转文本。
- PDF 文本抽取。

### 4. chunk 切分

文件建议：

- `backend/app/modules/documents/application/chunking.py`

先写简单版本：

```python
def split_text(text: str, *, chunk_size: int = 800, overlap: int = 120) -> list[str]:
    # TODO: 滑动窗口切分文本
```

学习点：

- chunk 太大：检索不准、prompt 成本高。
- chunk 太小：上下文不足。
- overlap 用来保留跨段信息。

### 5. 文档 API

文件：

- `backend/app/modules/documents/api/router.py`

接口：

- `POST /api/v1/documents/upload`
- `GET /api/v1/documents`
- `GET /api/v1/documents/{id}`
- `GET /api/v1/documents/{id}/chunks`

上传流程：

```text
校验 knowledge_base 存在
保存原始文件
创建 document 记录
解析文本
切 chunk
创建 chunk 记录
更新 document.status = completed
更新 knowledge_base.document_count/chunk_count
```

失败流程：

```text
捕获异常
document.status = failed
document.error_message = str(error)
```

## 前端 TODO

文件：

- `frontend/src/app/(workspace)/documents/page.tsx`

先实现这些状态：

- knowledge base 下拉列表。
- file input。
- upload loading。
- error message。
- documents table。

上传请求：

```ts
const formData = new FormData();
formData.append("knowledge_base_id", selectedKnowledgeBaseId);
formData.append("file", file);
```

注意：

- 上传 `FormData` 时不要手动设置 `Content-Type`，浏览器会自动加 boundary。
- 当前 `apiRequest` 默认会给 body 设置 JSON header，所以下一阶段要给它加一个 `isFormData` 判断。

## 验收练习

1. 登录。
2. 创建知识库。
3. 上传一个 `.txt`。
4. 文档列表看到状态 `completed`。
5. 文档详情能看到 chunks。
6. 刷新页面，数据仍存在。
