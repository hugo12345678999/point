import React, { useContext, useState, useEffect } from "react";
import { Button, Input } from "antd";
import "./Edit-garra-premio-adm.css";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as links from "../../../../utils/links";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";

const EditModoDeJogoAdm = (props) => {
  const { authInfo, setNotiMessage } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const [data, setData] = useState({
    valor: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [garrapegada, setgarrapegada] = useState(null); // Estado para armazenar o valor da probabilidade
  const [mododejogo, setmododejogo] = useState(null); // Estado para armazenar o valor da probabilidade

  const handleChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => {
      let errorsTemp = { ...prev };
      delete errorsTemp[name];
      return errorsTemp;
    });
  };

  const onSave = () => {
    let errorsTemp = {};
    if (data.valor === "") {
      errorsTemp.valor = "Este campo é obrigatório";
    }
    if(data.valor.trim() < 1){
      errorsTemp.valor = 'DIGITE UM VALOR MAIOR OU IGUAL A 1'
 
  }else{
      setNotiMessage({
          type: 'success',
          message: 'CONFIGURANDO GARRA PREMIO, AGUARDE 3 MINUTOS PARA CONFIGURAR OUTRA FUNCAO!'
      })

  }
  if(data.valor.trim() > 7){
      errorsTemp.valor = 'DIGITE UM VALOR MENOR OU IGUAL A 7'
 
  }
  if (parseFloat(data.valor) === garrapegada) {
      errorsTemp.valor = 'O VALOR É IGUAL!'
  }
    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }
    let VALOR_BASE;
    if (data.valor < 10) {
      VALOR_BASE = 200;
    } else {
      VALOR_BASE = 20;
    }
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/credito-remoto`,
        { id, valor: VALOR_BASE + data.valor },
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: res?.data?.retorno,
        });
      })
      .catch((err) => {
        setIsLoading(false);

        setNotiMessage({
          type: "error",
          message: err.response?.data?.msg
            ? err.response?.data?.msg
            : `A sua sessão expirou, para continuar faça login novamente.`,
        });
      });
  };

  const fetchmododejogo = () => {
    axios.get(`${process.env.REACT_APP_SERVIDOR}/modo-de-jogo/${id}`, {
      headers: {
        "x-access-token": token,
        "content-type": "application/json",
      },
    })
    .then((res) => {
      setmododejogo(res.data.mododejogo); // Atualize o estado com o valor da probabilidade recebido
    })
    .catch((err) => {
      // Lide com os erros da requisição
    });
  };

  useEffect(() => {
    fetchmododejogo(); // Fetch da probabilidade ao montar o componente
  }, [id]); // Execute sempre que o ID mudar

  return (
    <>
      {isLoading && <LoadingAction />}
      <div>
        <div className="Trocar_header">
          <div className="Trocar_header_title">MODO DE JOGO</div>
          <Button
            className="Trocar_header_back"
            onClick={() => {
              navigate(`${links.CLIENTES_MAQUINAS_FORNECEDOR_SEARCH}/${id}`, {
                state: location.state,
              });
            }}
          >
            <span>VOLTAR</span>
          </Button>
        </div>

        <div className="Trocar_content">
          <div className="Trocar_itemField">
            <label className="Trocar_itemFieldLabel" htmlFor="valor">
              Valor:
            </label>
            <Input
              placeholder={""}
              value={data.valor}
              id="valor"
              type="text"
              name="valor"
              autoComplete="valor"
              onChange={(event) => {
                handleChange("valor", event.target.value);
              }}
              className={`${!!errors.valor ? "Trocar_inputError" : ""}`}
            />
            {errors.valor && (
              <div className="Trocar_itemFieldError">{errors.valor}</div>
            )}
          </div>

          <Button
            className="Trocar_saveBtn"
            onClick={() => {
              if (!isLoading) onSave();
            }}
            disabled={isLoading}
          >
            ENVIAR
          </Button>

          {/* Exibir o valor da probabilidade */}
          <div className="garrapegadaResult">
           MODO DE JOGO: {mododejogo !== null ? mododejogo : "Carregando..." }
       
          </div>
        </div>
      </div>
    </>
  );
};

export default EditModoDeJogoAdm;
