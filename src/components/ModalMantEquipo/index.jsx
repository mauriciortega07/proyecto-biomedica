import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Drill, HardHat, History, Wrench, User } from "lucide-react";
import {
  ModalBackground,
  ModalContent,
  FormField,
  TextArea,
  TitleModal,
  ButtonSaveEquipment,
  ButtonCancelled,
  ButtonsContainer,
  TagsContainer,
  TabsContainer,
  TabButton,
  SectionCard,
  SectionTitle,
  TwoCols,
  ErrorBox,
  HistoryContainer,
  HistoryItem,
  Badge,
  EmptyState,
  SubTitle,
} from "./styles";

const IconColor = {
  text: "#6C757D",
  tool: "#28A745",
  wrench: "#FFC107",
  drill: "#ca7f05",
  user: "#007BFF",
};

const TIPOS = {
  PREVENTIVO: "PREVENTIVO",
  CORRECTIVO: "CORRECTIVO",
  PREDICTIVO: "PREDICTIVO",
};

const ESTADOS = {
  PROGRAMADO: "PROGRAMADO",
  FINALIZADO: "FINALIZADO",
};

const prettyTipo = (t) => {
  if (t === TIPOS.PREVENTIVO) return "Preventivo";
  if (t === TIPOS.CORRECTIVO) return "Correctivo";
  if (t === TIPOS.PREDICTIVO) return "Predictivo";
  return t;
};

const buildDateTimeISO = (fecha, hora) => {
  if (!fecha) return null;
  const time = hora && hora.trim() ? hora.trim() : "09:00";
  return `${fecha}T${time}:00`;
};

const isPast = (fechaISO) => {
  if (!fechaISO) return false;
  const d = new Date(fechaISO);
  return d.getTime() < Date.now();
};

const getUserMetaFromSession = () => {
  try {
    const raw = localStorage.getItem("user_session");
    if (!raw) return { usuario_id: null, nombre: "" };
    const session = JSON.parse(raw);
    return {
      usuario_id: session?.id ?? null,
      nombre: session?.name ?? "",
    };
  } catch {
    return { usuario_id: null, nombre: "" };
  }
};

const API_BASE_URL = (() => {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) return import.meta.env.VITE_API_URL;
  } catch {}
  if (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;

  return "http://localhost:4000";
})();

const toISOish = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string") {
    if (v.includes(" ") && !v.includes("T")) return v.replace(" ", "T");
    return v;
  }
  return String(v);
};

const mapDbToUi = (r) => ({
  id: r.id, 
  client_uid: r.client_uid ?? null,
  equipoId: r.equipo_id,
  tipo: r.tipo,
  estado: r.estado,
  fechaProgramada: toISOish(r.fecha_programada),
  descripcion: r.descripcion,
  realizadoPor: r.realizado_por,
  usuario_id: r.usuario_id,
  fechaFinalizado: toISOish(r.fecha_finalizado),
  createdAt: toISOish(r.created_at),
  updatedAt: toISOish(r.updated_at),
});

const ModalMantEquipment = ({
  equipoMant,
  setModalMantEquipment,
  setEquiposIniciales,
}) => {
  const [tab, setTab] = useState("PROGRAMAR");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [preventivo, setPreventivo] = useState("");
  const [correctivo, setCorrectivo] = useState("");
  const [predictivo, setPredictivo] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editFecha, setEditFecha] = useState("");
  const [editHora, setEditHora] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editRealizadoPor, setEditRealizadoPor] = useState("");
  const [editError, setEditError] = useState("");

  const [realizadoPor, setRealizadoPor] = useState("");
  const [usuarioIdSesion, setUsuarioIdSesion] = useState(null);

  const [formError, setFormError] = useState("");

  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleClose = () => setModalMantEquipment(false);

  const equipoLabel = useMemo(() => {
    if (!equipoMant) return "Equipo";
    return `${equipoMant.nombre || "Equipo"} (ID: ${equipoMant.id ?? "N/A"})`;
  }, [equipoMant]);

  const resetForm = () => {
    setFecha("");
    setHora("");
    setPreventivo("");
    setCorrectivo("");
    setPredictivo("");
    setFormError("");

    const meta = getUserMetaFromSession();
    setUsuarioIdSesion(meta.usuario_id);
    setRealizadoPor(meta.nombre || "");
  };

  const splitISO = (iso) => {
    if (!iso) return { f: "", h: "" };
    const s = toISOish(iso);
    const [f, rest] = (s || "").split("T");
    const h = (rest || "").slice(0, 5);
    return { f: f || "", h: h || "" };
  };

  const cargarMantenimientos = async () => {
    if (!equipoMant?.id) return;
    setApiError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/equipos_biomedicos/${equipoMant.id}/mantenimientos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error HTTP ${res.status}`);
      }

      const data = await res.json();
      const mapped = Array.isArray(data) ? data.map(mapDbToUi) : [];
      setMantenimientos(mapped);

      if (setEquiposIniciales) {
        setEquiposIniciales((prev) =>
          (prev || []).map((e) => {
            if (Number(e.id) !== Number(equipoMant.id)) return e;
            return { ...e, mantenimientosHistorial: mapped };
          })
        );
      }
    } catch (e) {
      setApiError(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTab("PROGRAMAR");
    resetForm();
    setEditingId(null);
    setApiError("");
    setMantenimientos([]);

    cargarMantenimientos();
  }, [equipoMant?.id]);

  const crearItemsPayload = () => {
    const fechaISO = buildDateTimeISO(fecha, hora);
    const items = [];

    const meta = getUserMetaFromSession();
    const quien = (realizadoPor || "").trim() || (meta.nombre || "").trim() || "Anonimo";
    const usuario_id = meta.usuario_id ?? usuarioIdSesion ?? null;

    const base = {
      estado: ESTADOS.PROGRAMADO,
      fechaProgramada: fechaISO,
      realizadoPor: quien,
      usuario_id,
    
    };

    if (preventivo.trim()) {
      items.push({
        id: `${Date.now()}-P-${Math.random()}`,
        tipo: TIPOS.PREVENTIVO,
        descripcion: preventivo.trim(),
        ...base,
      });
    }
    if (correctivo.trim()) {
      items.push({
        id: `${Date.now()}-C-${Math.random()}`,
        tipo: TIPOS.CORRECTIVO,
        descripcion: correctivo.trim(),
        ...base,
      });
    }
    if (predictivo.trim()) {
      items.push({
        id: `${Date.now()}-PR-${Math.random()}`,
        tipo: TIPOS.PREDICTIVO,
        descripcion: predictivo.trim(),
        ...base,
      });
    }

    return { fechaISO, items };
  };

  const handleProgramar = async () => {
    setFormError("");
    setApiError("");

    if (!equipoMant?.id) {
      setFormError("No se detectó el ID del equipo seleccionado.");
      return;
    }
    if (!fecha) {
      setFormError("Selecciona una fecha para programar el mantenimiento.");
      return;
    }

    const { fechaISO, items } = crearItemsPayload();

    if (!fechaISO) {
      setFormError("Fecha inválida.");
      return;
    }
    if (items.length === 0) {
      setFormError("Escribe al menos un mantenimiento (preventivo, correctivo o predictivo).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/equipos_biomedicos/${equipoMant.id}/mantenimientos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error HTTP ${res.status}`);
      }

      await cargarMantenimientos();

      resetForm();
      setTab("HISTORIAL");
    } catch (e) {
      setApiError(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const finalizarMantenimiento = async (id) => {
    setApiError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/mantenimientos/${id}/finalizar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error HTTP ${res.status}`);
      }

      await cargarMantenimientos();
      setTab("HISTORIAL");
    } catch (e) {
      setApiError(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const finalizarTodosProgramados = async () => {
    if (!equipoMant?.id) return;
    setApiError("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/equipos_biomedicos/${equipoMant.id}/mantenimientos/finalizar_todos`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error HTTP ${res.status}`);
      }

      await cargarMantenimientos();
      setTab("HISTORIAL");
    } catch (e) {
      setApiError(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (m) => {
    setEditError("");
    setEditingId(m.id);

    const { f, h } = splitISO(m.fechaProgramada);
    setEditFecha(f);
    setEditHora(h);

    setEditDescripcion(m.descripcion || "");
    setEditRealizadoPor(m.realizadoPor || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFecha("");
    setEditHora("");
    setEditDescripcion("");
    setEditRealizadoPor("");
    setEditError("");
  };

  const saveEdit = async (id) => {
    setEditError("");
    setApiError("");

    if (!editFecha) {
      setEditError("Selecciona una fecha.");
      return;
    }
    if (!editDescripcion.trim()) {
      setEditError("La descripción no puede ir vacía.");
      return;
    }

    const meta = getUserMetaFromSession();
    const quien = (editRealizadoPor || "").trim() || (meta.nombre || "").trim() || "Anonimo";
    const usuario_id = meta.usuario_id ?? usuarioIdSesion ?? null;

    const fechaISO = buildDateTimeISO(editFecha, editHora);

    setLoading(true);
    try {
      const res = await fetch(`/api/mantenimientos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fechaProgramada: fechaISO,
          descripcion: editDescripcion.trim(),
          realizadoPor: quien,
          usuario_id,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Error HTTP ${res.status}`);
      }

      await cargarMantenimientos();
      cancelEdit();
    } catch (e) {
      setApiError(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const programados = mantenimientos.filter((h) => (h.estado || ESTADOS.PROGRAMADO) === ESTADOS.PROGRAMADO);
  const finalizados = mantenimientos.filter((h) => h.estado === ESTADOS.FINALIZADO);

  return (
    <ModalBackground onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <TitleModal>Mantenimientos del Equipo</TitleModal>
        <SubTitle>{equipoLabel}</SubTitle>

        <TabsContainer>
          <TabButton $active={tab === "PROGRAMAR"} onClick={() => setTab("PROGRAMAR")}>
            Programar
          </TabButton>
          <TabButton $active={tab === "HISTORIAL"} onClick={() => setTab("HISTORIAL")}>
            <History size={18} style={{ marginRight: 8 }} /> Historial
          </TabButton>
        </TabsContainer>

        {apiError ? <ErrorBox>• {apiError}</ErrorBox> : null}

        {tab === "PROGRAMAR" ? (
          <>
            {formError ? <ErrorBox>• {formError}</ErrorBox> : null}

            <SectionCard>
              <SectionTitle>Responsable</SectionTitle>
              <TagsContainer>
                <User size={18} color={IconColor.user} style={{ margin: "0px 10px" }} />
                ¿Quién realizó / programó el mantenimiento?
              </TagsContainer>

              <FormField
                type="text"
                placeholder="Si lo dejas vacío, se usa el usuario en sesión"
                value={realizadoPor}
                onChange={(e) => setRealizadoPor(e.target.value)}
                disabled={loading}
              />

              <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "#666" }}>
                Default: <strong>{getUserMetaFromSession().nombre || "Sin sesión"}</strong>
              </p>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Programar fecha</SectionTitle>
              <TwoCols>
                <div>
                  <TagsContainer>
                    <Calendar size={18} color={IconColor.text} style={{ margin: "0px 10px" }} />
                    Día
                  </TagsContainer>
                  <FormField type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={loading} />
                </div>

                <div>
                  <TagsContainer>
                    <Clock size={18} color={IconColor.text} style={{ margin: "0px 10px" }} />
                    Hora (opcional)
                  </TagsContainer>
                  <FormField type="time" value={hora} onChange={(e) => setHora(e.target.value)} disabled={loading} />
                </div>
              </TwoCols>
              <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "#666" }}>
                Si no eliges hora, se tomará <strong>09:00</strong>.
              </p>
            </SectionCard>

            <SectionCard>
              <SectionTitle>
                <HardHat size={18} color={IconColor.tool} style={{ marginRight: 10 }} />
                Preventivo
              </SectionTitle>
              <TextArea
                placeholder="Describe el mantenimiento preventivo"
                value={preventivo}
                onChange={(e) => setPreventivo(e.target.value)}
                disabled={loading}
              />
            </SectionCard>

            <SectionCard>
              <SectionTitle>
                <Drill size={18} color={IconColor.drill} style={{ marginRight: 10 }} />
                Correctivo
              </SectionTitle>
              <TextArea
                placeholder="Describe el mantenimiento correctivo"
                value={correctivo}
                onChange={(e) => setCorrectivo(e.target.value)}
                disabled={loading}
              />
            </SectionCard>

            <SectionCard>
              <SectionTitle>
                <Wrench size={18} color={IconColor.wrench} style={{ marginRight: 10 }} />
                Predictivo
              </SectionTitle>
              <TextArea
                placeholder="Describe el mantenimiento predictivo"
                value={predictivo}
                onChange={(e) => setPredictivo(e.target.value)}
                disabled={loading}
              />
            </SectionCard>

            <ButtonsContainer>
              <ButtonCancelled type="button" onClick={handleClose} disabled={loading}>
                Cerrar
              </ButtonCancelled>
              <ButtonSaveEquipment type="button" onClick={handleProgramar} disabled={loading}>
                {loading ? "Guardando..." : "Programar mantenimiento"}
              </ButtonSaveEquipment>
            </ButtonsContainer>
          </>
        ) : (
          <>
            <HistoryContainer>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <SectionTitle>Programados</SectionTitle>

                <button
                  type="button"
                  onClick={finalizarTodosProgramados}
                  disabled={loading || programados.length === 0}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "1px solid #ddd",
                    cursor: loading || programados.length === 0 ? "not-allowed" : "pointer",
                    fontWeight: 800,
                    opacity: loading || programados.length === 0 ? 0.6 : 1,
                  }}
                  title="Marca como FINALIZADO todos los mantenimientos programados"
                >
                  Finalizar todos
                </button>
              </div>

              {loading ? (
                <EmptyState>Cargando...</EmptyState>
              ) : programados.length === 0 ? (
                <EmptyState>No tienes mantenimientos programados.</EmptyState>
              ) : (
                programados.map((h) => {
                  const isEditing = editingId === h.id;

                  return (
                    <HistoryItem key={h.id}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Badge $tipo={h.tipo}>{prettyTipo(h.tipo)}</Badge>

                        <strong>{(h.fechaProgramada || "").replace("T", " ").slice(0, 16)}</strong>

                        {isPast(h.fechaProgramada) ? (
                          <span style={{ fontWeight: 900, color: "#ca7f05" }}>VENCIDO</span>
                        ) : null}

                        <span style={{ marginLeft: "auto", fontWeight: 700, color: "#666" }}>
                          {h.estado || ESTADOS.PROGRAMADO}
                        </span>
                      </div>

                      {isEditing ? (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <User size={18} color={IconColor.user} />
                            <input
                              value={editRealizadoPor}
                              onChange={(e) => setEditRealizadoPor(e.target.value)}
                              placeholder="Responsable (si vacío, toma sesión)"
                              style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "10px",
                                border: "1px solid #ddd",
                              }}
                            />
                          </div>
                        </div>
                      ) : h.realizadoPor ? (
                        <div style={{ marginTop: 6, fontSize: "0.9rem", color: "#666" }}>
                          Realizado por: <strong>{h.realizadoPor}</strong>
                        </div>
                      ) : null}

                      {isEditing ? (
                        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                              <Calendar size={18} color={IconColor.text} />
                              <strong>Fecha</strong>
                            </div>
                            <input
                              type="date"
                              value={editFecha}
                              onChange={(e) => setEditFecha(e.target.value)}
                              style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "10px",
                                border: "1px solid #ddd",
                              }}
                            />
                          </div>

                          <div style={{ width: 170 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                              <Clock size={18} color={IconColor.text} />
                              <strong>Hora</strong>
                            </div>
                            <input
                              type="time"
                              value={editHora}
                              onChange={(e) => setEditHora(e.target.value)}
                              style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "10px",
                                border: "1px solid #ddd",
                              }}
                            />
                          </div>
                        </div>
                      ) : null}

                      {isEditing ? (
                        <div style={{ marginTop: 12 }}>
                          <textarea
                            value={editDescripcion}
                            onChange={(e) => setEditDescripcion(e.target.value)}
                            style={{
                              width: "100%",
                              minHeight: "90px",
                              padding: "10px",
                              borderRadius: "10px",
                              border: "1px solid #ddd",
                              resize: "vertical",
                            }}
                          />
                          {editError ? (
                            <div style={{ marginTop: 8, color: "#b00020", fontWeight: 800 }}>
                              • {editError}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{h.descripcion}</div>
                      )}

                      <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              style={{
                                padding: "10px 14px",
                                borderRadius: "12px",
                                border: "1px solid #ddd",
                                background: "#fff",
                                cursor: "pointer",
                                fontWeight: 900,
                              }}
                              disabled={loading}
                            >
                              Cancelar
                            </button>

                            <button
                              type="button"
                              onClick={() => saveEdit(h.id)}
                              style={{
                                padding: "10px 14px",
                                borderRadius: "12px",
                                border: "1px solid #111",
                                background: "#111",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: 900,
                              }}
                              disabled={loading}
                            >
                              Guardar cambios
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(h)}
                              style={{
                                padding: "10px 14px",
                                borderRadius: "12px",
                                border: "1px solid #ddd",
                                background: "#fff",
                                cursor: "pointer",
                                fontWeight: 900,
                              }}
                              title="Editar mantenimiento programado"
                              disabled={loading}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => finalizarMantenimiento(h.id)}
                              style={{
                                padding: "10px 14px",
                                borderRadius: "12px",
                                border: "1px solid #111",
                                background: "#111",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: 900,
                              }}
                              title="Marcar este mantenimiento como FINALIZADO"
                              disabled={loading}
                            >
                              Finalizar
                            </button>
                          </>
                        )}
                      </div>
                    </HistoryItem>
                  );
                })
              )}

              <SectionTitle style={{ marginTop: 18 }}>Historial (finalizados)</SectionTitle>
              {loading ? (
                <EmptyState>Cargando...</EmptyState>
              ) : finalizados.length === 0 ? (
                <EmptyState>Aún no hay historial (finalizados).</EmptyState>
              ) : (
                finalizados.map((h) => (
                  <HistoryItem key={h.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Badge $tipo={h.tipo}>{prettyTipo(h.tipo)}</Badge>

                      <strong>{(h.fechaProgramada || "").replace("T", " ").slice(0, 16)}</strong>

                      <span style={{ marginLeft: "auto", fontWeight: 700, color: "#666" }}>{h.estado}</span>
                    </div>

                    {h.realizadoPor ? (
                      <div style={{ marginTop: 6, fontSize: "0.9rem", color: "#666" }}>
                        Realizado por: <strong>{h.realizadoPor}</strong>
                      </div>
                    ) : null}

                    {h.fechaFinalizado ? (
                      <div style={{ marginTop: 6, fontSize: "0.85rem", color: "#666" }}>
                        Finalizado el: <strong>{toISOish(h.fechaFinalizado).replace("T", " ").slice(0, 16)}</strong>
                      </div>
                    ) : null}

                    <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{h.descripcion}</div>
                  </HistoryItem>
                ))
              )}
            </HistoryContainer>

            <ButtonsContainer>
              <ButtonCancelled type="button" onClick={handleClose} disabled={loading}>
                Cerrar
              </ButtonCancelled>
              <ButtonSaveEquipment
                type="button"
                onClick={() => {
                  resetForm();
                  setTab("PROGRAMAR");
                }}
                disabled={loading}
              >
                Programar nuevo
              </ButtonSaveEquipment>
            </ButtonsContainer>
          </>
        )}
      </ModalContent>
    </ModalBackground>
  );
};

export default ModalMantEquipment;
