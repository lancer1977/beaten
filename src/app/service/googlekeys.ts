export   class GoogleKeys {
   static nameToKey: { [name: string]: string } = { 
        dreadbreadcrumb: '10Hu_5R8jtQRNUHp7dk47c7Tm9atCEJcdJbQYPN1AOoE',
        segafan001: '1midxH6qx0J6i9OqxNsdQA9M8Y_aInugXNk5lFQ0tDIE'
    };

   static  getKeyByName(name: string): string { return this.nameToKey[name] };



}
