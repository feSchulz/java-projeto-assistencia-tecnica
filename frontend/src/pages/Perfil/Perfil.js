import React, { useEffect, useState } from "react";
import { FiUser, FiSave } from "react-icons/fi";
import { useSelector } from "react-redux";
import { buscarMeuPerfil, atualizarMeuPerfil } from "../../services/AuthService";
import { listarEstados, listarCidades } from "../../services/EnderecoService";
import { onlyDigits, maskCpf, maskTelefone, maskCep } from "../../utils/masks";

const initialForm = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  rua: "",
  numero: "",
  bairro: "",
  complemento: "",
  cep: "",
  estadoId: "",
  cidadeId: "",
  senha: "",
  confirmarSenha: "",
};

const Perfil = () => {
  const { token } = useSelector((state) => state.auth);

  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [preservandoCidadeAtual, setPreservandoCidadeAtual] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const carregarPerfil = () => {
    setLoading(true);
    setError("");
    buscarMeuPerfil(token)
      .then((dados) => {
        setPerfil(dados);

        setForm({
          nome: dados.nome || "",
          cpf: onlyDigits(dados.cpf),
          telefone: onlyDigits(dados.telefone),
          email: dados.email || "",
          rua: dados.rua || "",
          numero: dados.numero != null ? String(dados.numero) : "",
          bairro: dados.bairro || "",
          complemento: dados.complemento || "",
          cep: onlyDigits(dados.cep),
          estadoId: dados.estadoId != null ? String(dados.estadoId) : "",
          cidadeId: dados.cidadeId != null ? String(dados.cidadeId) : "",
          senha: "",
          confirmarSenha: "",
        });
        setCidades(
          dados.cidadeId != null
            ? [{ id: dados.cidadeId, nome: dados.cidadeNome || `Cidade ${dados.cidadeId}` }]
            : []
        );
        // Com o estado conhecido, a lista de cidades daquele estado é carregada
        // normalmente; sem ele, mantém só a cidade atual como opção.
        setPreservandoCidadeAtual(dados.estadoId == null);
      })
      .catch((err) => setError(err.message || "Não foi possível carregar os dados do perfil."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarPerfil();
    setLoadingEstados(true);
    listarEstados(token)
      .then(setEstados)
      .catch((err) => {
        console.error("Erro ao carregar estados:", err);
        setEstados([]);
      })
      .finally(() => setLoadingEstados(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (preservandoCidadeAtual) return;
    if (!form.estadoId) {
      setCidades([]);
      return;
    }

    setLoadingCidades(true);
    listarCidades(form.estadoId, token)
      .then(setCidades)
      .catch((err) => {
        console.error("Erro ao carregar cidades:", err);
        setCidades([]);
      })
      .finally(() => setLoadingCidades(false));
  }, [form.estadoId, token, preservandoCidadeAtual]);

  const handleChange = (field) => (e) => {
    let { value } = e.target;

    if (field === "cpf") value = onlyDigits(value).slice(0, 11);
    if (field === "telefone") value = onlyDigits(value).slice(0, 11);
    if (field === "cep") value = onlyDigits(value).slice(0, 8);
    if (field === "numero") value = onlyDigits(value);
    if (field === "estadoId") setPreservandoCidadeAtual(false);

    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "estadoId" ? { cidadeId: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback("");

    const obrigatorios = ["nome", "cpf", "telefone", "email", "rua", "numero", "bairro", "cep", "cidadeId"];
    const faltando = obrigatorios.some((campo) => !form[campo]);
    if (faltando) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (form.cpf.length !== 11) {
      setError("CPF inválido: informe os 11 dígitos.");
      return;
    }

    if (form.telefone.length < 10) {
      setError("Telefone inválido: informe DDD e número.");
      return;
    }

    if (form.senha && form.senha !== form.confirmarSenha) {
      setError("A confirmação de senha não coincide com a nova senha.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nome: form.nome,
        cpf: form.cpf,
        telefone: form.telefone,
        email: form.email,
        rua: form.rua,
        numero: Number(form.numero),
        bairro: form.bairro,
        complemento: form.complemento,
        cep: form.cep,
        cidadeId: Number(form.cidadeId),
      };

      if (form.senha) {
        payload.senha = form.senha;
      }

      await atualizarMeuPerfil(payload, token);
      setFeedback("Perfil atualizado com sucesso.");
      setForm((prev) => ({ ...prev, senha: "", confirmarSenha: "" }));
      carregarPerfil();
    } catch (err) {
      setError(err.message || "Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <FiUser className="text-lg" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-blue-900">Meu perfil</h2>
          <p className="text-xs text-gray-500">
            Visualize e atualize seus dados pessoais e de acesso.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="rounded-md border border-green-100 bg-green-50 px-4 py-2 text-sm text-green-700">
          {feedback}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-6 text-center text-sm text-gray-500">
          Carregando perfil...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="grid grid-cols-2 gap-4 px-6 py-5">
            <div className="col-span-2 border-b border-gray-100 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
                Acesso
              </span>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Login</label>
              <input
                type="text"
                value={perfil?.login || ""}
                disabled
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Papel</label>
              <input
                type="text"
                value={perfil?.papelNome || "—"}
                disabled
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Nova senha</label>
              <input
                type="password"
                value={form.senha}
                onChange={handleChange("senha")}
                placeholder="Deixe em branco para manter"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Confirmar nova senha</label>
              <input
                type="password"
                value={form.confirmarSenha}
                onChange={handleChange("confirmarSenha")}
                placeholder="Repita a nova senha"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="col-span-2 mt-2 border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
                Dados pessoais
              </span>
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Nome completo</label>
              <input
                type="text"
                value={form.nome}
                onChange={handleChange("nome")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">CPF</label>
              <input
                type="text"
                inputMode="numeric"
                value={maskCpf(form.cpf)}
                onChange={handleChange("cpf")}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Telefone</label>
              <input
                type="text"
                inputMode="numeric"
                value={maskTelefone(form.telefone)}
                onChange={handleChange("telefone")}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="col-span-2 mt-2 border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
                Endereço
              </span>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Estado</label>
              <select
                value={form.estadoId}
                onChange={handleChange("estadoId")}
                disabled={loadingEstados}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">
                  {loadingEstados ? "Carregando..." : preservandoCidadeAtual ? "Trocar estado/cidade" : "Selecione"}
                </option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Cidade</label>
              <select
                value={form.cidadeId}
                onChange={handleChange("cidadeId")}
                disabled={(!form.estadoId && !preservandoCidadeAtual) || loadingCidades}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">{loadingCidades ? "Carregando..." : "Selecione"}</option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Rua</label>
              <input
                type="text"
                value={form.rua}
                onChange={handleChange("rua")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Número</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.numero}
                onChange={handleChange("numero")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Bairro</label>
              <input
                type="text"
                value={form.bairro}
                onChange={handleChange("bairro")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Complemento</label>
              <input
                type="text"
                value={form.complemento}
                onChange={handleChange("complemento")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">CEP</label>
              <input
                type="text"
                inputMode="numeric"
                value={maskCep(form.cep)}
                onChange={handleChange("cep")}
                placeholder="00000-000"
                maxLength={9}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSave className="text-sm" />
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default Perfil;
