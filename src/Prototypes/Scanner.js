function Scanner(position) {
    this.id = id;
    this.length = 10;
    this.belt = position.x;
    //posiciones inicial y final del scanner
    this.start = position.y;
    this.end = position + length;
    //sprite
}

Scanner.prototype={
    EnterBag: function(Bag)
    {
        if(this.currentBag == null)
        {
            this.currentBag=Bag;
            this.entryTime = game.time.time;
            return true;
        }
        else
        {
            return false;
        }
    },
    ExitBag: function()
    {

        let exitBag = this.currentBag;
        exitBag.moveBag(this.end);
        this.currentBag = null;
        this.entryTime = null;
        return exitBag;
    },
    DisplayScanner: function()
    {
        
    }

}