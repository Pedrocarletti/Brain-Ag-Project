import { FormEvent, useMemo, useState } from 'react';
import { Edit2, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { ColumnConfig, FieldConfig } from '../types';

type FormState = Record<string, string>;

interface CrudPanelProps<T extends { id: string }> {
  title: string;
  description: string;
  items: T[];
  fields: FieldConfig[];
  columns: ColumnConfig<T>[];
  getInitialForm: () => FormState;
  toForm: (item: T) => FormState;
  onCreate: (values: FormState) => Promise<void>;
  onUpdate?: (id: string, values: FormState) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  search?: string;
  onSearch?: (value: string) => void;
  loading?: boolean;
}

export function CrudPanel<T extends { id: string }>({
  title,
  description,
  items,
  fields,
  columns,
  getInitialForm,
  toForm,
  onCreate,
  onUpdate,
  onDelete,
  onRefresh,
  search,
  onSearch,
  loading,
}: CrudPanelProps<T>) {
  const [form, setForm] = useState<FormState>(() => getInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const isEditing = Boolean(editingId);

  const visibleFields = useMemo(() => fields, [fields]);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function reset() {
    setForm(getInitialForm());
    setEditingId(null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (editingId && onUpdate) {
      await onUpdate(editingId, form);
    } else {
      await onCreate(form);
    }
    reset();
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <button className="iconButton" type="button" onClick={onRefresh} title="Atualizar dados">
          <RefreshCw size={18} />
        </button>
      </div>

      <form className="formGrid" onSubmit={submit}>
        {visibleFields.map((field) => (
          <label key={field.name} className="field">
            <span>{field.label}</span>
            {field.type === 'select' ? (
              <select value={form[field.name] ?? ''} required={field.required} onChange={(event) => updateField(field.name, event.target.value)}>
                <option value="">Selecione</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form[field.name] ?? ''}
                required={field.required}
                type={field.type ?? 'text'}
                placeholder={field.placeholder}
                onChange={(event) => updateField(field.name, event.target.value)}
              />
            )}
          </label>
        ))}

        <div className="formActions">
          <button className="primaryButton" type="submit">
            {isEditing ? <Save size={17} /> : <Plus size={17} />}
            {isEditing ? 'Salvar' : 'Criar'}
          </button>
          {isEditing && (
            <button className="secondaryButton" type="button" onClick={reset}>
              <X size={17} />
              Cancelar
            </button>
          )}
        </div>
      </form>

      {onSearch && (
        <div className="tableToolbar">
          <input value={search ?? ''} placeholder="Buscar" onChange={(event) => onSearch(event.target.value)} />
          <span>{items.length} registro(s)</span>
        </div>
      )}

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.header}>{column.header}</th>
              ))}
              <th className="actionsColumn">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={column.header}>{column.render(item)}</td>
                ))}
                <td>
                  <div className="rowActions">
                    {onUpdate && (
                      <button
                        className="iconButton"
                        type="button"
                        title="Editar"
                        onClick={() => {
                          setEditingId(item.id);
                          setForm(toForm(item));
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button className="iconButton danger" type="button" title="Excluir" onClick={() => onDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={columns.length + 1} className="emptyState">
                  {loading ? 'Carregando...' : 'Nenhum registro encontrado.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
