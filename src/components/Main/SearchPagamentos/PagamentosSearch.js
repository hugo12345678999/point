import React, { useCallback, useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./PagamentosSearch.css";
import { Button, Col, Input, Row, Table } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import _, { debounce } from "lodash";
import axios from "axios";
import { useParams } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import * as links from "../../../utils/links";
import {
  AiOutlineEdit,
  AiFillDelete,
  AiFillDollarCircle,
} from "react-icons/ai";
import qr_code_icon from "../../../assets/images/QR.png";
import notes from "../../../assets/images/notes.png";

const PagamentosSearch = (props) => {
  const location = useLocation();
  const maquinaInfos = location.state;
  const { setDataUser, loading, authInfo, setNotiMessage } =
    useContext(AuthContext);
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
    if (estado === 1) {
      setNotiMessage({
        type: "warning",
        message: "Valor estado igual a 1",
      });
      navigate(`${links.PAGAMNETO_PPP}/${id}`); // Redireciona para PAGAMNETO_PPP com o ID na URL
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

  const getMaquinas = (id) => {
    axios
      .get(`${process.env.REACT_APP_SERVIDOR}/maquinas`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.data)) {
          const maquinasData = res.data.find((item) => item.id === id);
          setDataMaquinas(maquinasData ?? null);
        } else {
          throw new Error();
        }
      })
      .catch((err) => {});
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
      title: "Data",
      dataIndex: "data",
      key: "data",
      width: 500,
      render: (data) => (
        <span>{moment(data).format("DD/MM/YYYY HH:mm:ss")}</span>
      ),
    },
    {
      title: "Forma de pagamento",
      dataIndex: "tipo",
      key: "tipo",
      render: (tipo, record) => (
        <span>
          {tipo === "bank_transfer"
            ? "PIX"
            : tipo === "CASH"
            ? "Especie"
            : tipo === "debit_card"
            ? "Débito"
            : tipo === "credit_card"
            ? "Crédito"
            : ""}
        </span>
      ),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      render: (valor) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valor),
    },
    {
      title: "Identificador MP",
      dataIndex: "mercadoPagoId",
      key: "mercadoPagoId",
    },
    {
      title: "Estornado",
      dataIndex: "estornado",
      key: "estornado",
      width: 100,
      render: (estornado, record) =>
        estornado ? (
          <OverlayTrigger
            key={record.key}
            placement="top"
            overlay={
              <Tooltip id={`tooltip-top-${record.key}`}>
                {record.motivoEstorno
                  ? record.motivoEstorno
                  : "Sem motivo registrado"}
              </Tooltip>
            }
          >
            <span style={{ color: "gray", cursor: "pointer" }}>
              {estornado ? "Estornado" : "Recebido"}
            </span>
          </OverlayTrigger>
        ) : (
          <span style={{ color: estornado ? "gray" : "green" }}>
            {estornado ? "Estornado" : "Recebido"}
          </span>
        ),
    },
  ];

  const formatNumberWithLeadingZeros = (number, length) => {
    const numStr = number.toString();
    return numStr.padStart(length, '0');
  };

  const onRelatorioHandler = () => {
    if (!dataInicio && !dataFim) {
      setNotiMessage({
        type: "error",
        message:
          "selecione no calendario a esquerda a data de inicio e firm para gerar o relatorio para essa maquina!",
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
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.EDIT_FORNECEDOR_CANAIS}/${id}`, {
                state: { maquinaInfos },
              });
            }}
          >
            <AiOutlineEdit className="Dashboard_staBlockTitleIcon" />
            Editar
          </Button>
        </div>
        <div className="PagamentosSearch_header_right">
          <Input
            className="PagamentosSearch_search"
            placeholder="Buscar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            className="PagamentosSearch_searchBtn"
            icon={<FontAwesomeIcon icon={faSearch} />}
            onClick={_.debounce(() => getData(id), 300)}
          />
        </div>
      </div>
      <div className="PagamentosSearch_content">
        <Row>
          <Col>
            <span>Data de Início:</span>
            <RangePicker
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
        <div className="PagamentosSearch_footer">
          <Button
            className="PagamentosSearch_relatorioBtn"
            onClick={onRelatorioHandler}
          >
            Gerar Relatório
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PagamentosSearch;
