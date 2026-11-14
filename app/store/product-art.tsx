/** Generated merchandise concept mockups based on the authentic /stjohn-logo.png crest. */
type Props={kind?:'tee'|'polo'|'hoodie'|'cap'|'tote'|'bottle'|'senior-crewneck';category?:string;color:string;name:string};
export default function ProductArt({kind,category,name}:Props){
 const type=kind||category||'tee';const positions:Record<string,string>={tee:'0% 0%',polo:'50% 0%',hoodie:'100% 0%',cap:'0% 100%',tote:'50% 100%',bottle:'100% 100%'};
 return <figure style={{margin:0,width:'100%',position:'relative'}}><div role="img" aria-label={`${name} concept illustration. ${type==='tote'?'Natural':'Navy'} design shown.`} style={{width:'100%',aspectRatio:'1',backgroundImage:type==='senior-crewneck'?'url(/store/senior-athlete.webp)':'url(/store/saints-collection.webp)',backgroundSize:type==='senior-crewneck'?'cover':'300% 200%',backgroundPosition:positions[type]||positions.tee}}/><figcaption style={{position:'absolute',bottom:10,left:12,color:'#536175',fontSize:10,background:'#ffffffd9',padding:'3px 6px',borderRadius:3}}>{type==='tote'?'Natural':'Navy'} concept shown</figcaption></figure>;
}
