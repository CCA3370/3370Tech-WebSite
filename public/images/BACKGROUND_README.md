# 背景图片说明

## 背景图片位置

请将您的背景图片放置在以下位置：
```
public/images/hero-background.jpg
```

## 推荐规格

- **分辨率**: 1920x1080 或更高（推荐 4K: 3840x2160）
- **格式**: JPG 或 WebP（推荐 WebP 以获得更好的性能）
- **文件大小**: 建议压缩到 500KB 以下
- **内容**: 科技感、现代感的图片，避免过于复杂的细节

## 图片效果

背景图片会有以下动态效果：
1. **滚动虚化**: 向下滚动时，背景会逐渐模糊（最大 20px 模糊）
2. **透明度变化**: 滚动时透明度降低，让内容更清晰
3. **缩放效果**: 轻微放大效果，增加视觉深度
4. **叠加层**: 主题颜色叠加层，确保文字可读性

## 图片来源建议

可以从以下网站获取免费高质量图片：
- Unsplash (https://unsplash.com)
- Pexels (https://pexels.com)
- Pixabay (https://pixabay.com)

搜索关键词：
- "technology background"
- "abstract tech"
- "digital network"
- "modern technology"
- "software development"

## 临时占位图

如果暂时没有图片，可以使用纯色背景或渐变：

在 `src/app/[locale]/page.tsx` 中修改背景样式：

```tsx
// 使用渐变背景
style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  filter: `blur(${scrollProgress * 20}px)`,
  opacity: 1 - scrollProgress * 0.5,
  transform: `scale(${1 + scrollProgress * 0.1})`
}}

// 或使用纯色
style={{
  backgroundColor: '#1a1a2e',
  filter: `blur(${scrollProgress * 20}px)`,
  opacity: 1 - scrollProgress * 0.5,
  transform: `scale(${1 + scrollProgress * 0.1})`
}}
```

## 注意事项

1. 确保图片版权允许商业使用
2. 优化图片大小以提升加载速度
3. 考虑使用 WebP 格式以获得更好的压缩率
4. 可以为不同主题准备不同的背景图片
