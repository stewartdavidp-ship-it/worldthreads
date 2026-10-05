(function(root,factory){const model=factory();if(typeof module==='object'&&module.exports)module.exports=model;else root.WorldThreadsJourney=model;})(typeof window==='object'?window:globalThis,function(){
  function nextConnection(thread,selected,relationships){
    const candidates=relationships.filter(r=>thread.relationshipIds?.includes(r.id)&&r.subjectId===selected);
    return candidates.sort((a,b)=>thread.nodeIds.indexOf(a.objectId)-thread.nodeIds.indexOf(b.objectId))[0]||null;
  }
  function neighbourhood(thread,selected,relationships,depth){
    const ids=new Set(thread.nodeIds);let frontier=new Set(thread.nodeIds);
    for(let step=0;step<depth;step++){
      const next=new Set();for(const r of relationships){if(frontier.has(r.subjectId)&&!ids.has(r.objectId))next.add(r.objectId);if(frontier.has(r.objectId)&&!ids.has(r.subjectId))next.add(r.subjectId);}
      for(const id of next)ids.add(id);frontier=next;
    }
    ids.add(selected);return [...ids];
  }
  function storyEdges(thread,relationships){return relationships.filter(r=>thread.relationshipIds?.includes(r.id)&&thread.nodeIds.includes(r.subjectId)&&thread.nodeIds.includes(r.objectId));}
  return {nextConnection,neighbourhood,storyEdges};
});
