import React, { useContext, useEffect, useState } from "react";
import "./ClienteMaquinas.css";
import { Button, Col, Row } from "antd";
import axios from "axios";
import * as links from "../../../../utils/links";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { AiOutlineEdit, AiOutlinePlusCircle } from "react-icons/ai";

const ClienteMaquinas = () => {
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);
  const { dataUser } = authInfo;
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const clienteInfo = location.state;
  const token = authInfo?.dataUser?.token;

  const [totalClienteMaquinas, setTotalClienteMaquinas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      axios
        .get(`${process.env.REACT_APP_SERVIDOR}/maquinas-adm?id=${id}`, {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setTotalClienteMaquinas(res.data);
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          if ([401, 403].includes(err.response.status)) {
            setNotiMessage({
              type: "error",
              message:
                "A sua sessão expirou, para continuar faça login novamente.",
            });
            setDataUser(null);
          }
        })
        .finally(() => setIsLoading(false));
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [id, token, setDataUser, setNotiMessage]);

  const handleMachineClick = (post) => {
    // Fazer a requisição GET para verificar o estado da máquina
    axios
      .get(`${process.env.REACT_APP_SERVIDOR}/maquina/${post.id}`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const machineStatus = res.data.estado; // Assumindo que o estado está na propriedade `estado`

          if (machineStatus === 1) {
            navigate(`${links.CLIENTES_MAQUINAS_FORNECEDOR_WHATSAPP}/${post.id}`, {
              state: { clienteInfo, maquinaInfos: post },
            });
          } else if (machineStatus === 2) {
            navigate(`${links.CLIENTES_MAQUINAS_FORNECEDOR_SEARCH}/${post.id}`, {
              state: { clienteInfo, maquinaInfos: post },
            });
          } else {
            console.error("Estado da máquina não reconhecido:", machineStatus);
          }
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar o estado da máquina:", err);
        // Tratar erros de requisição, se necessário
      });
  };

  return (
    <div className="Cliente_Maquinas_container">
      {isLoading && <LoadingAction />}
      <div className="WarningMsgSpan">
        <span>{dataUser?.warningMsg}</span>
      </div>
      <div className="AddCliente_header">
        <div className="AddCliente_header_title">Dispositivos do cliente:</div>
        <Link className="AddCliente_header_back" to={links.DASHBOARD_CLIENTES}>
          VOLTAR
        </Link>
      </div>
      <div className="Cliente_Maquinas_header">
        <div className="Cliente_Maquinas_staBlockTitle">{clienteInfo.nome}</div>
      </div>
      <div className="Cliente_Maquinas_action">
        <Button style={{ margin: "0 15px" }} onClick={() => fetchData()}>
          <FontAwesomeIcon
            icon={faArrowsRotate}
            style={{ marginRight: "5px" }}
          />
          Atualizar
        </Button>
        <Button
          className="Cliente_Maquinas_addbtn"
          onClick={() =>
            navigate(`${links.ADD_CLIENTES_MAQUINA_ADM}/${clienteInfo.id}`, {
              state: location.state,
            })
          }
        >
          <AiOutlinePlusCircle />
          <span>Adicionar Máquina</span>
        </Button>
        <Button
          className="Cliente_Maquinas_addbtn"
          onClick={() =>
            navigate(`${links.EDITAR_CLIENTES}/${clienteInfo.id}`, {
              state: clienteInfo,
            })
          }
        >
          <AiOutlineEdit />
          <span>Editar Cliente</span>
        </Button>
      </div>
      <Row>
        {totalClienteMaquinas.map((post) => (
          <Col xs={24} md={24} lg={8} xl={8} className="Cliente_Maquinas_col" key={post.id}>
            <div onClick={() => handleMachineClick(post)}>
              <div className="maquina">
                <div className="maquina-info">
                  {(() => {
                    switch (post.status) {
                      case "ONLINE":
                        return (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            color={"green"}
                            className="logout-icon fa-3x"
                          />
                        );
                      case "OFFLINE":
                        return (
                          <FontAwesomeIcon
                            icon={faXmarkCircle}
                            color={"red"}
                            className="logout-icon fa-3x"
                          />
                        );
                      case "PAGAMENTO_RECENTE":
                        return (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            color={"blue"}
                            className="logout-icon fa-3x"
                          />
                        );
                      default:
                        return null;
                    }
                  })()}
                  <h2>{post.nome}</h2>
                  <h4 style={{ fontWeight: "300" }}>
                    {post.status} - {post.descricao}
                  </h4>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ClienteMaquinas;
