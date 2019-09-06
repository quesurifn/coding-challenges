module.exports = function isEqual(objA, objB) {      
    const aProps = Object.getOwnPropertyNames(objA);     
    const bProps = Object.getOwnPropertyNames(objB);

    if (aProps.length != bProps.length) {         
        return false;     
    }      
    for (let i = 0; i < aProps.length; i++) {         
         
         const propName = aProps[i];          
       
         if (objA[propName] !== objB[propName]) {             
             return false;         
         }     
    }   
    return true; 
    }  