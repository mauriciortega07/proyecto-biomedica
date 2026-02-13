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

// ✅ Lee user_session como lo traes en tu proyecto (ModalChargeDB etc.)
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

const ModalMantEquipment = ({
  equipoMant,
  setModalMantEquipment,
  equiposIniciales,
  setEquiposIniciales,
}) => {
  const [tab, setTab] = useState("PROGRAMAR"); // PROGRAMAR | HISTORIAL
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [preventivo, setPreventivo] = useState("");
  const [correctivo, setCorrectivo] = useState("");
  const [predictivo, setPredictivo] = useState("");

  // ✅ NUEVO: quién realizó/programó el mantenimiento
  const [realizadoPor, setRealizadoPor] = useState("");
  const [usuarioIdSesion, setUsuarioIdSesion] = useState(null);

  const [formError, setFormError] = useState("");

  // Historial local (mock) mientras conectamos la BD
  const [historialLocal, setHistorialLocal] = useState([]);

  const handleClose = () => setModalMantEquipment(false);

  const equipoLabel = useMemo(() => {
    if (!equipoMant) return "Equipo";
    return `${equipoMant.nombre || "Equipo"} (ID: ${equipoMant.id ?? "N/A"})`;
  }, [equipoMant]);

  useEffect(() => {
    // Reset al abrir/cambiar de equipo
    setTab("PROGRAMAR");
    setFecha("");
    setHora("");
    setPreventivo("");
    setCorrectivo("");
    setPredictivo("");
    setFormError("");

    // ✅ Default: usuario en sesión (si existe)
    const meta = getUserMetaFromSession();
    setUsuarioIdSesion(meta.usuario_id);
    setRealizadoPor(meta.nombre || ""); // si no hay sesión, queda vacío

    // Si ya traes algo “temporal” pegado al equipo en estado, lo mostramos
    const pre = Array.isArray(equipoMant?.mantenimientosHistorial)
      ? equipoMant.mantenimientosHistorial
      : [];
    setHistorialLocal(pre);
  }, [equipoMant?.id]);

  const crearItems = () => {
    const fechaISO = buildDateTimeISO(fecha, hora);
    const items = [];

    // ✅ Si el usuario no escribe quién lo hizo, usa el de sesión como default
    const meta = getUserMetaFromSession();
    const quien = (realizadoPor || "").trim() || (meta.nombre || "").trim() || "Anonimo";
    const usuario_id = meta.usuario_id ?? usuarioIdSesion ?? null;

    if (preventivo.trim()) {
      items.push({
        id: `${Date.now()}-P-${Math.random()}`,
        equipoId: equipoMant?.id,
        tipo: TIPOS.PREVENTIVO,
        fechaProgramada: fechaISO,
        descripcion: preventivo.trim(),
        estado: "PROGRAMADO",

        // ✅ NUEVO
        realizadoPor: quien,
        usuario_id,
      });
    }

    if (correctivo.trim()) {
      items.push({
        id: `${Date.now()}-C-${Math.random()}`,
        equipoId: equipoMant?.id,
        tipo: TIPOS.CORRECTIVO,
        fechaProgramada: fechaISO,
        descripcion: correctivo.trim(),
        estado: "PROGRAMADO",

        // ✅ NUEVO
        realizadoPor: quien,
        usuario_id,
      });
    }

    if (predictivo.trim()) {
      items.push({
        id: `${Date.now()}-PR-${Math.random()}`,
        equipoId: equipoMant?.id,
        tipo: TIPOS.PREDICTIVO,
        fechaProgramada: fechaISO,
        descripcion: predictivo.trim(),
        estado: "PROGRAMADO",

        // ✅ NUEVO
        realizadoPor: quien,
        usuario_id,
      });
    }

    return { fechaISO, items };
  };

  const handleProgramar = () => {
    setFormError("");

    if (!equipoMant?.id) {
      setFormError("No se detectó el ID del equipo seleccionado.");
      return;
    }

    if (!fecha) {
      setFormError("Selecciona una fecha para programar el mantenimiento.");
      return;
    }

    const { fechaISO, items } = crearItems();

    if (!fechaISO) {
      setFormError("Fecha inválida.");
      return;
    }

    if (items.length === 0) {
      setFormError("Escribe al menos un mantenimiento (preventivo, correctivo o predictivo).");
      return;
    }

    // ✅ Front-only: lo guardamos en memoria local del modal
    setHistorialLocal((prev) => [...items, ...prev]);

    // ✅ Persistir temporalmente en el estado global del equipo
    if (setEquiposIniciales) {
      setEquiposIniciales((prev) =>
        (prev || []).map((e) => {
          if (Number(e.id) !== Number(equipoMant.id)) return e;
          const current = Array.isArray(e.mantenimientosHistorial)
            ? e.mantenimientosHistorial
            : [];
          return {
            ...e,
            mantenimientosHistorial: [...items, ...current],
          };
        })
      );
    }

    // Reset form + manda a historial
    setPreventivo("");
    setCorrectivo("");
    setPredictivo("");
    setTab("HISTORIAL");
  };

  const programados = historialLocal.filter((h) => !isPast(h.fechaProgramada));
  const pasados = historialLocal.filter((h) => isPast(h.fechaProgramada));

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

        {tab === "PROGRAMAR" ? (
          <>
            {formError ? <ErrorBox>• {formError}</ErrorBox> : null}

            {/* ✅ NUEVO: Quién realiza / responsable */}
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
                  <FormField type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>

                <div>
                  <TagsContainer>
                    <Clock size={18} color={IconColor.text} style={{ margin: "0px 10px" }} />
                    Hora (opcional)
                  </TagsContainer>
                  <FormField type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
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
                placeholder="Describe el mantenimiento preventivo (puedes escribir todo lo necesario)"
                value={preventivo}
                onChange={(e) => setPreventivo(e.target.value)}
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
              />
            </SectionCard>

            <ButtonsContainer>
              <ButtonCancelled type="button" onClick={handleClose}>
                Cerrar
              </ButtonCancelled>
              <ButtonSaveEquipment type="button" onClick={handleProgramar}>
                Programar mantenimiento
              </ButtonSaveEquipment>
            </ButtonsContainer>
          </>
        ) : (
          <>
            <HistoryContainer>
              <SectionTitle>Programados</SectionTitle>
              {programados.length === 0 ? (
                <EmptyState>No tienes mantenimientos programados.</EmptyState>
              ) : (
                programados.map((h) => (
                  <HistoryItem key={h.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Badge $tipo={h.tipo}>{prettyTipo(h.tipo)}</Badge>
                      <strong>{(h.fechaProgramada || "").replace("T", " ").slice(0, 16)}</strong>
                      <span style={{ marginLeft: "auto", fontWeight: 700, color: "#666" }}>{h.estado}</span>
                    </div>

                    {/* ✅ NUEVO: responsable */}
                    {h.realizadoPor ? (
                      <div style={{ marginTop: 6, fontSize: "0.9rem", color: "#666" }}>
                        Realizado por: <strong>{h.realizadoPor}</strong>
                      </div>
                    ) : null}

                    <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{h.descripcion}</div>
                  </HistoryItem>
                ))
              )}

              <SectionTitle style={{ marginTop: 18 }}>Historial (pasados)</SectionTitle>
              {pasados.length === 0 ? (
                <EmptyState>Aún no hay historial (pasados).</EmptyState>
              ) : (
                pasados.map((h) => (
                  <HistoryItem key={h.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Badge $tipo={h.tipo}>{prettyTipo(h.tipo)}</Badge>
                      <strong>{(h.fechaProgramada || "").replace("T", " ").slice(0, 16)}</strong>
                      <span style={{ marginLeft: "auto", fontWeight: 700, color: "#666" }}>{h.estado}</span>
                    </div>

                    {/* ✅ NUEVO: responsable */}
                    {h.realizadoPor ? (
                      <div style={{ marginTop: 6, fontSize: "0.9rem", color: "#666" }}>
                        Realizado por: <strong>{h.realizadoPor}</strong>
                      </div>
                    ) : null}

                    <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{h.descripcion}</div>
                  </HistoryItem>
                ))
              )}
            </HistoryContainer>

            <ButtonsContainer>
              <ButtonCancelled type="button" onClick={handleClose}>
                Cerrar
              </ButtonCancelled>
              <ButtonSaveEquipment type="button" onClick={() => setTab("PROGRAMAR")}>
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
