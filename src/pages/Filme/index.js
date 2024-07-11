import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import api from '../../services/api';
import './filme-info.css';

function Filme(){

    const {id} = useParams();
    const navigate = useNavigate();

    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function loadFilme(){
            await api.get(`/movie/${id}`, {
                params:{
                    api_key: "a08d8c5dea5542a252764952695318b5",
                    language: "pt-BR",
                }
            })
            .then((response)=>{
                setFilme(response.data);
                console.log(response.data);
                setLoading(false);
            })
            .catch(()=>{
                console.log("Filme não encontrado"); 
                navigate("/", { replace:true });
                return;
            })
        }
        loadFilme();

        return () => {
            console.log("Componente desmontado")
        }
    }, [navigate, id])

    function salvarFilme(){
        const minhaLista = localStorage.getItem("@primeflix");

        let filmeSalvos = JSON.parse(minhaLista) || [];

        const hasFilme = filmeSalvos.some((filmeSalvos) => filmeSalvos.id === filme.id)

        if(hasFilme){
            toast.warn("ESSE FILME JÁ ESTA NA SUA LISTA!!!");
            return;
        }

        filmeSalvos.push(filme);
        localStorage.setItem("@primeflix", JSON.stringify(filmeSalvos));
        toast.success("Filme salvo com sucesso!");
    }

    if(loading){
        return(
            <div className="filme-info">
                <h1>Carregando detalhes...</h1>
            </div>
        )
    }
    return (
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}/>
            <h3>Sinopse</h3>
            <span>{filme.overview}</span>
            <strong>Avaliação: {filme.vote_average} / 10</strong>

            <div className="area-buttons">
                <button onClick={salvarFilme}>Salvar</button>
                <button>
                    <a href={`https://youtube.com/results?search_query=${filme.title} trailer`} target="blank" rel="external"> 
                        Trailer
                    </a>
                </button>
            </div>
        </div>
    );
}

export default Filme;