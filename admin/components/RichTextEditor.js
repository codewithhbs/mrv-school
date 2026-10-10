'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading2, Heading3, Heading4, Pilcrow,
  List, ListOrdered, Quote, Minus, Link2, Unlink, ImagePlus, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, Undo2, Redo2, Code2, RemoveFormatting, Loader2,
  Table as TableIcon, Rows3, Columns3, Trash2, PanelTop,
} from 'lucide-react';
import { uploadFile, API_BASE_URL } from '@/lib/api';
import { htmlToText } from '@/lib/site';

const MEDIA_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

function absoluteMedia(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${MEDIA_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Older records were saved as plain text from a textarea — turn their line
// breaks into paragraphs so they open cleanly in the editor.
export function toEditorHtml(value) {
  if (!value) return '';
  if (/<\/?[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .split(/\n{2,}/)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-red text-white' : 'text-slate hover:bg-paper hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="w-px h-5 bg-line mx-1" />;

export default function RichTextEditor({ label, required, hint, value, onChange, placeholder }) {
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: null, target: null },
      }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder || 'Write the full article here…' }),
      Table.configure({ resizable: false, HTMLAttributes: {} }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: toEditorHtml(value),
    editorProps: { attributes: { class: 'rte-content focus:outline-none' } },
    onUpdate: ({ editor: ed }) => {
      onChangeRef.current(ed.isEmpty ? '' : ed.getHTML());
    },
  });

  // Keep the editor in sync if the parent swaps the record (e.g. edit → another edit).
  useEffect(() => {
    if (!editor || sourceMode) return;
    const incoming = toEditorHtml(value);
    if (incoming !== editor.getHTML() && !(editor.isEmpty && !incoming)) {
      editor.commands.setContent(incoming, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  function setLink() {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Link URL (https://… or /page-path)', prev);
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    const external = /^https?:\/\//i.test(url) && !url.includes('mrvpublicschool.com');
    const newTab = external ? window.confirm('Open this link in a new tab?') : false;
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.trim(), target: newTab ? '_blank' : null })
      .run();
  }

  async function handleImage(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const result = await uploadFile('image', file);
      const alt = window.prompt('Image alt text (describe the image — important for SEO)', '') || '';
      editor.chain().focus().setImage({ src: absoluteMedia(result.url), alt: alt.trim() }).run();
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  function toggleSource() {
    if (!editor) return;
    if (sourceMode) {
      editor.commands.setContent(sourceHtml || '', true);
      setSourceMode(false);
    } else {
      setSourceHtml(editor.isEmpty ? '' : editor.getHTML());
      setSourceMode(true);
    }
  }

  const wordCount = htmlToText(sourceMode ? sourceHtml : value).split(' ').filter(Boolean).length;

  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red">*</span>}
      </label>

      <div className="rounded-lg border border-line bg-white focus-within:border-red focus-within:ring-1 focus-within:ring-red transition-colors">
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-line bg-paper/60 rounded-t-lg">
          {editor && !sourceMode && (
            <>
              <ToolbarButton title="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}><Pilcrow className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Heading 4" active={editor.isActive('heading', { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 className="w-4 h-4" /></ToolbarButton>
              <Divider />
              <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="w-4 h-4" /></ToolbarButton>
              <Divider />
              <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Divider line" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="w-4 h-4" /></ToolbarButton>
              <Divider />
              <ToolbarButton title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Justify" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}><AlignJustify className="w-4 h-4" /></ToolbarButton>
              <Divider />
              <ToolbarButton title="Add / edit link" active={editor.isActive('link')} onClick={setLink}><Link2 className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}><Unlink className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Insert image" disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              </ToolbarButton>
              <ToolbarButton title="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()}><TableIcon className="w-4 h-4" /></ToolbarButton>
              {editor.isActive('table') && (
                <>
                  <ToolbarButton title="Add row below" onClick={() => editor.chain().focus().addRowAfter().run()}><Rows3 className="w-4 h-4" /></ToolbarButton>
                  <ToolbarButton title="Add column right" onClick={() => editor.chain().focus().addColumnAfter().run()}><Columns3 className="w-4 h-4" /></ToolbarButton>
                  <ToolbarButton title="Toggle header row" onClick={() => editor.chain().focus().toggleHeaderRow().run()}><PanelTop className="w-4 h-4" /></ToolbarButton>
                  <ToolbarButton title="Delete row" onClick={() => editor.chain().focus().deleteRow().run()}><span className="text-[10px] font-bold px-0.5">−R</span></ToolbarButton>
                  <ToolbarButton title="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()}><span className="text-[10px] font-bold px-0.5">−C</span></ToolbarButton>
                  <ToolbarButton title="Delete table" onClick={() => editor.chain().focus().deleteTable().run()}><Trash2 className="w-4 h-4" /></ToolbarButton>
                </>
              )}
              <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><RemoveFormatting className="w-4 h-4" /></ToolbarButton>
              <Divider />
              <ToolbarButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="w-4 h-4" /></ToolbarButton>
            </>
          )}
          <div className="ml-auto">
            <ToolbarButton title={sourceMode ? 'Back to visual editor' : 'Edit HTML source'} active={sourceMode} onClick={toggleSource}>
              <Code2 className="w-4 h-4" />
            </ToolbarButton>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImage} />
        </div>

        {sourceMode ? (
          <textarea
            className="w-full min-h-[320px] p-4 font-mono text-xs text-ink outline-none rounded-b-lg resize-y"
            value={sourceHtml}
            onChange={(e) => {
              setSourceHtml(e.target.value);
              onChange(e.target.value);
            }}
          />
        ) : (
          <div className="px-4 py-3 min-h-[320px] max-h-[65vh] overflow-y-auto">
            {editor ? <EditorContent editor={editor} /> : <Loader2 className="w-4 h-4 animate-spin text-slate" />}
          </div>
        )}

        <div className="flex items-center justify-between px-3 py-1.5 border-t border-line text-[11px] text-slate">
          <span>Use H2 for sections, H3 for sub-sections — page title is already the H1. Paste from Google Docs keeps headings, lists, bold, links &amp; tables.</span>
          <span className={wordCount && wordCount < 300 ? 'text-gold-dark' : ''}>{wordCount} words</span>
        </div>
      </div>

      {uploadError && <p className="text-xs text-red mt-1">{uploadError}</p>}
      {hint && <p className="text-xs text-slate mt-1">{hint}</p>}
    </div>
  );
}
