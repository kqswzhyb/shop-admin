export const downLoadFile = (data: any, filename: string) => {
    let blob=new Blob([data], {type: "application/vnd.ms-excel"})
    let href=URL.createObjectURL(blob)
    let link = document.createElement('a');

    link.href = href;
    link.download = filename;

    // fix Firefox
    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  
};