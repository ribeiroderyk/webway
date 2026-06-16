# Mídia — Especificação de Telas

---

## Tela: Biblioteca de Mídia

**Rota:** `/app/sites/[siteId]/media`  
**Layout:** Admin padrão  
**Acesso:** Autenticado + dono do site

### Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ Sites / Studio Web Way / Mídia                                    │
│ Mídia                                          [+ Fazer upload]   │
│ Biblioteca de arquivos de Studio Web Way                          │
│                                                                   │
│ ┌────────────────────────────────────────────────────────────┐    │
│ │ [🔍 Buscar arquivos...]      [Tipo ▼]  [≡ Lista] [⊞ Grid] │    │
│ └────────────────────────────────────────────────────────────┘    │
│                                                                   │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│ │ [img]  │ │ [img]  │ │ [🖼️]  │ │ [img]  │ │ [📄]   │          │
│ │        │ │        │ │        │ │        │ │        │          │
│ │foto.jpg│ │logo.png│ │banner  │ │team.jpg│ │doc.pdf │          │
│ │ 256 KB │ │ 45 KB  │ │ 890 KB │ │ 512 KB │ │ 2.4 MB │          │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘          │
│                                                                   │
│ ┌────────┐ ┌────────┐ ┌────────┐                                  │
│ │ [img]  │ │ [img]  │ │ [+]    │  ← botão de upload              │
│ │about   │ │hero    │ │ Upload │                                  │
│ │ 340 KB │ │ 1.2 MB │ │        │                                  │
│ └────────┘ └────────┘ └────────┘                                  │
│                                                                   │
│                          7 arquivos · 5.4 MB                     │
└────────────────────────────────────────────────────────────────────┘
```

### MediaCard — Hover State

```
┌────────────────┐
│ [██░░░░░░░░░░] │  ← overlay escuro
│ [Copiar URL]   │  ← ações
│ [Editar]       │
│ [Excluir]      │
└────────────────┘
```

### Filtros

- Tipo: Todos, Imagens, Documentos, Vídeos
- Busca por nome do arquivo
- Ordenação: Mais recente (padrão), Nome A-Z, Tamanho

---

## Modal: Upload de Arquivo

Aberto ao clicar "+ Fazer upload" ou na área de upload.

```
┌───────────────────────────────────────────────────┐
│  Fazer upload                                [×]  │
│  ─────────────────────────────────────────────    │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │                                             │  │
│  │          📁                                 │  │
│  │                                             │  │
│  │   Arraste arquivos aqui ou clique           │  │
│  │   para selecionar                           │  │
│  │                                             │  │
│  │   PNG, JPG, GIF, WEBP, SVG, PDF            │  │
│  │   Máximo 10MB por arquivo                  │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  [Selecionar arquivo]                             │
│                                                   │
│  ─────────────────────────────────────────────    │
│  Arquivos selecionados:                           │
│  ✅ foto-equipe.jpg (256 KB)   [Remover]          │
│  ⏳ banner.png    (890 KB)   [Processando...]     │
│                                                   │
│                         [Cancelar]  [Enviar]      │
└───────────────────────────────────────────────────┘
```

### Regras de Upload

| Atributo     | Regra                                    |
|--------------|------------------------------------------|
| Tipos aceitos| image/*, application/pdf                 |
| Tamanho max  | 10MB por arquivo                         |
| Múltiplos    | Sim, até 10 por vez                      |
| Storage      | Local `/public/uploads/[siteId]/` no MVP |
| Otimização   | Preservar original (otimização futura)   |
| Nomear       | Sanitizar nome + timestamp para unicidade|

### Processo de Upload

1. Seleção de arquivo(s)
2. Preview local (FileReader para imagens)
3. Progresso individual por arquivo
4. POST `/api/sites/[siteId]/media/upload`
5. Salvar registro no banco (Media model)
6. Retornar fileUrl, dimensions se imagem

---

## Modal: Editar Arquivo

```
┌───────────────────────────────────────────────────┐
│  Editar arquivo                              [×]  │
│  ─────────────────────────────────────────────    │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │                                             │  │
│  │           [PREVIEW DO ARQUIVO]              │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Nome do arquivo                                  │
│  foto-equipe.jpg          (somente leitura)       │
│                                                   │
│  Texto alternativo (alt) *                        │
│  [Foto da equipe do Studio Web Way            ]   │
│  Importante para SEO e acessibilidade             │
│                                                   │
│  Legenda                                          │
│  [                                            ]   │
│                                                   │
│  Informações                                      │
│  Tipo: image/jpeg                                 │
│  Tamanho: 256 KB                                  │
│  Dimensões: 1200 × 800px                         │
│  Enviado: 10/06/2026                              │
│                                                   │
│  URL do arquivo:                                  │
│  /uploads/studio/foto-equipe.jpg  [Copiar URL]    │
│                                                   │
│                         [Cancelar]  [Salvar]      │
└───────────────────────────────────────────────────┘
```

---

## MediaPicker (Componente Reutilizável)

Usado no editor de blocos e no formulário de posts para selecionar mídia existente ou fazer upload.

```
┌───────────────────────────────────────────────────┐
│  Selecionar mídia                            [×]  │
│  ─────────────────────────────────────────────    │
│                                                   │
│  [Biblioteca] [Fazer Upload]                      │
│  ─────────────────────────                        │
│                                                   │
│  [🔍 Buscar...]                                   │
│                                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ img  │ │ img  │ │ img  │ │ img  │             │
│  └──────┘ └──────┘ └──────┘ └──────┘             │
│                                                   │
│  Selecionado: foto-equipe.jpg                     │
│                                                   │
│                         [Cancelar]  [Selecionar]  │
└───────────────────────────────────────────────────┘
```

---

## Storage

### MVP: Storage Local

```
/public/uploads/
  [siteId]/
    [timestamp]-[filename]
```

`fileUrl` = `/uploads/[siteId]/[filename]`

### Adaptador para Cloud (Futuro)

```ts
// /src/lib/storage.ts
interface StorageAdapter {
  upload(file: Buffer, key: string, mimeType: string): Promise<string>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}

// Implementações:
// LocalStorageAdapter (MVP)
// S3Adapter
// CloudflareR2Adapter
// MinIOAdapter
```

A variável de ambiente `STORAGE_PROVIDER` determina qual adapter usar.

---

## Dados

```ts
// Modelo Media
interface Media {
  id: string;
  siteId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;        // bytes
  width: number | null;
  height: number | null;
  altText: string;
  caption: string;
  createdAt: Date;
}
```
