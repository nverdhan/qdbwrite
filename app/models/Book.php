<?php

class Book extends Eloquent {

	protected $table = 'books';
	protected $primaryKey = 'id';
	protected $guarded = array('*');
	protected $hidden = array('publisher_id', 'subject_id');

	public function getBooks(){
		$booklist1 = Book::with('Chapter')->with('Publisher')->get();
		return $booklist1;
	}

	public function Publisher()
	{
		return $this->belongsTo('Publisher');
	}

	public function Chapter(){
		return $this->hasMany('Chapter');
	}

}