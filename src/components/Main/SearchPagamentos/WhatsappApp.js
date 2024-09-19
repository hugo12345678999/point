import React, { useCallback, useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./WhatsappApp.css";
import { Button, Col, Row, Table } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { AiFillDelete } from "react-icons/ai";
import * as links from "../../../utils/links";

const WhatsappApp = (props) => {
  const location = useLocation();
  const maquinaInfos = location.state;
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);
  let navigate = useNavigate();
  const token = authInfo?.dataUser?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [listCanals, setListCanals] = useState([]);
  const [estornos, setEstornos] = useState("");
  const [probabilidade, setProbabilidade] = useState("");
  const [estoque, setEstoque] = useState("");
  const [contadorcredito, setContadorCredito] = useState("");
  const [contadorpelucia, setContadorPelucia] = useState("");
  const [cash, setCash] = useState("");
  const [estado, setEstado] = useState("");
  const [informacao, setInformacao] = useState("");
  const [total, setTotal] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [dataMaquinas, setDataMaquinas] = useState(null);
  const { id } = useParams();
  const { RangePicker } = DatePicker;

  useEffect(() => {
    getData(id);
  }, []);

  useEffect(() => {
    if (dataFim != null) {
      getPaymentsPeriod(dataInicio, dataFim);
    }
  }, [dataFim]);

  useEffect(() => {
    if (estado == 2) {
      navigate(`${links.WHATSAPP_MAQUINA}/${id}`);
    }
  }, [estado, navigate, id, setNotiMessage]);


  const getData = (id) => {
    if (id.trim() !== "") {
      setLoadingTable(true);
      axios
        .get(`${process.env.REACT_APP_SERVIDOR}/pagamentos/${id}`, {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        })
        .then((res) => {
          setLoadingTable(false);
          setEstornos(res.data.estornos);
          setCash(res?.data?.cash);
          setProbabilidade(res?.data?.probabilidade);
          setEstoque(res?.data?.estoque);
          setContadorCredito(res?.data?.contadorcredito);
          setInformacao(res?.data?.informacao);
          setEstado(res?.data?.estado);
          setContadorPelucia(res?.data?.contadorpelucia);
          setTotal(res.data.total);
          if (res.status === 200 && Array.isArray(res.data.pagamentos)) {
            setListCanals(res.data.pagamentos);
          }
        })
        .catch((err) => {
          setLoadingTable(false);
          if ([401, 403].includes(err.response.status)) {
            setNotiMessage({
              type: "error",
              message:
                "A sua sessão expirou, para continuar faça login novamente.",
            });
            setDataUser(null);
          }
        });
    }
  };

  const getPaymentsPeriod = (dataInicio, dataFim) => {
    if (id.trim() !== "") {
      setLoadingTable(true);
      const url = `${process.env.REACT_APP_SERVIDOR}/pagamentos-periodo/${id}`;
      axios
        .post(
          url,
          {
            dataInicio: dataInicio + "T00:00:00.000Z",
            dataFim: dataFim + "T23:59:00.000Z",
          },
          {
            headers: {
              "x-access-token": token,
              "content-type": "application/json",
            },
          }
        )
        .then((res) => {
          setLoadingTable(false);
          setEstornos(res.data.estornos);
          setCash(res?.data?.cash);
          setTotal(res.data.total);
          if (res.status === 200 && Array.isArray(res.data.pagamentos)) {
            setListCanals(res.data.pagamentos);
          }
        })
        .catch((err) => {
          setLoadingTable(false);
          if ([401, 403].includes(err.response.status)) {
            setNotiMessage({
              type: "error",
              message:
                "A sua sessão expirou, para continuar faça login novamente.",
            });
            setDataUser(null);
          }
        });
    }
  };

  const columns = [
    {
      title: "DATA",
      dataIndex: "data",
      key: "data",
      render: (data) => (
        <span>{moment(data).format("DD/MM/YYYY HH:mm:ss")}</span>
      ),
    },
    {
      title: "TIPO DE PROCESSO",
      dataIndex: "tipo",
      key: "tipo",
      render: (tipo) => (
        <span>
          {tipo === "bank_transfer"
            ? "PIX"
            : tipo === "CASH"
            ? "SAIDA"
            : tipo === "PELUCIA"
            ? "ENTRADA"
            : tipo === "debit_card"
            ? "ENTRADA"
            : tipo === "credit_card"
            ? "Crédito"
            : ""}
        </span>
      ),
    },
    {
      title: "PRODUTO",
      dataIndex: "mercadoPagoId",
      key: "mercadoPagoId",
    },
  ];

  const onRelatorioHandler = () => {
    if (!dataInicio && !dataFim) {
      setNotiMessage({
        type: "error",
        message:
          "Selecione no calendário a data de início e fim para gerar o relatório",
      });
    } else {
      navigate(`${links.RELATORIO}/${id}`, {
        state: { maquinaInfos, dataInicio, dataFim },
      });
    }
  };

  return (
    <div className="PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="PagamentosSearch_header">
        <div className="PagamentosSearch_header_left">
          <div className="Dashboard_staBlockTitle">{maquinaInfos?.nome}</div>
      
          <Button
            className="Update_Pagamento_deletBtn"
            onClick={() => {
              navigate(`${links.DELETE_FORNECEDOR_CANAIS}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiFillDelete />
            <span>Excluir Pagamentos</span>
          </Button>
          <Button
            className="Update_Pagamento_saveBtn"
            onClick={() => {
              navigate(`${links.EDIT_WHATSAPP_MAQUINA}/${id}`, {
                state: location.state,
              });
            }}
          >
            CONFIGURAR FUNCOES
          </Button>

        </div>
        <div style={{ marginLeft: "1px" }}>RELOGIO</div>
              <div className="PagamentosSearch_nbList1">
                {contadorpelucia ?? "-"}
                </div>
      </div>
      <div className="PagamentosSearch_content">
        <Row>
          <Col>
            <span></span>
            <RangePicker
              style={{ border: "1px solid", borderRadius: "4px" }}
              className="PagamentosSearch_picker"
              placeholder={["Início", "Fim"]}
              format="DD/MM/YYYY"
              onChange={(dates, dateStrings) => {
                setDataInicio(dateStrings[0]);
                setDataFim(dateStrings[1]);
              }}
            />
          </Col>
        </Row>
        <div className="PagamentosSearch_table">
          <Table
            dataSource={listCanals}
            columns={columns}
            pagination={false}
            loading={loadingTable}
            rowKey={(record) => record?.mercadoPagoId}
          />
        </div>
      </div>
    </div>
  );
};

export default WhatsappApp;
