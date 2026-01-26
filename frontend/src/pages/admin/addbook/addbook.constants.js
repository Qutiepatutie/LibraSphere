export const initialFormValues = {
    isbn: "",
    title: "",
    author: "",
    edition: "",
    description: "",
    publisher: "",
    dateAcquired: "",
    yearPublished: "",
    pages: "",
    tags: "",
    classification: "",
    callNumber: "",
    coverURL: null,
}

export const labelToName = {
    ISBN : "isbn",
    Publisher : "publisher",
    Title : "title",
    Date_Aquired : "dateAcquired",
    Author : "author",
    Year_Published : "yearPublished",
    Edition : "edition",
    Pages : "pages",
    Description : "description",
    Tags : "tags",
    Classification : "classification",
    Call_Number : "callNumber",
}

export const initialFormErrors = {
    isbn:  false,
    title : false,
    author : false,
    edition : false,
    description : false,
    publisher : false,
    dateAcquired : false,
    yearPublished : false,
    pages : false,
    tags : false,
    classification : false,
    callNumber : false
}